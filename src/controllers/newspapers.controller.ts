import { Request, Response } from 'express'
import db from '../database/connection'
import * as aws from 'aws-sdk'
import sharp from 'sharp'
import del from 'del'
import fs from 'fs'
import path from 'path'

require('dotenv').config()

aws.config.region = process.env.AWS_REGION

const get = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const result = await db.query(
      `SELECT  newspaper_pages.name as pageName, 
                      newspaper_pages.page_number as pageNumber,
                      newspapers.newspaper_key as newspaperKey
                      FROM newspapers 
                      LEFT JOIN newspaper_pages ON newspapers.id = newspaper_pages.newspaper_id
                      WHERE newspapers.id = $1
                      ORDER BY newspaper_pages.page_number DESC`,
      [id]
    )

    res.send({
      success: true,
      pages: result.rows
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || 'Something went wrong'
    })
  }
}

const getPublishers = async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM publishers')

    return res.status(200).send({
      success: true,
      publisher: result.rows
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || 'Something went wrong'
    })
  }
}

interface UploadParams {
  Bucket: string
  Key: string
  Body: Buffer
}

const upload = async (req: Request, res: Response) => {
  // newspaperName should include the date in it
  const { file, index, documentName, isNewPage, id, isNewspaper } = req.body

  let fileContent = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64')

  const s3 = new aws.S3({ signatureVersion: 'v4' })
  let S3_BUCKET = process.env.S3_BUCKET || ''

  const pageName = `${documentName}_page_${index + 1}`
  var documentId: number | null
  var result = { rows: [{ id: null }] }

  try {
    if (isNewPage) {
      result = await db.query(`SELECT * FROM newspapers WHERE id = $1`, [id])
    }

    // If the newspaper exists
    if (result.rows.length && result.rows[0].id && !isNewPage) {
      return res.send({
        success: false,
        message: 'Already exists'
      })

      // If it's a new page from the newspaper
    } else if (isNewPage) {
      documentId = result.rows[0].id

      // Add new newspaper
    } else {
      // initialize to save the newspaper pages and get the id
      const insertResult = await db.query('INSERT INTO newspapers (newspaper_key) VALUES ($1) RETURNING id', [
        documentName
      ])

      documentId = insertResult.rows[0].id
    }
  } catch (error) {
    console.log(error)
    return res.send({
      success: false,
      message: 'Failed'
    })
  }

  sharp(fileContent)
    .tile({
      size: 256
    })
    .toFile(`${pageName}.dz`, (err) => {
      if (err) {
        console.log(err)
        return
      }

      const walkSync = (currentDirPath: string, callback: Function) => {
        fs.readdirSync(currentDirPath).forEach((name) => {
          const filePath = path.join(currentDirPath, name)
          const stat = fs.statSync(filePath)

          if (stat.isFile()) {
            callback(filePath, stat)
          } else if (stat.isDirectory()) {
            walkSync(filePath, callback)
          }
        })
      }

      walkSync(`${pageName}_files`, async (filePath: string) => {
        let bucketPath = filePath.substring(`${pageName}_files`.length + 1)
        let params: UploadParams = {
          Bucket: S3_BUCKET,
          Key: `misc/${documentName}/${pageName}/${pageName}_files/${bucketPath}`,
          Body: fs.readFileSync(filePath)
        }

        try {
          await s3.putObject(params).promise()
          console.log(`Successfully uploaded ${bucketPath} to s3 bucket`)
        } catch (error) {
          console.error(`error in uploading ${bucketPath} to s3 bucket`)
        }
      })

      let params = {
        Bucket: S3_BUCKET,
        Key: `misc/${documentName}/${pageName}/${pageName}.dzi`,
        Body: fs.readFileSync(`${pageName}.dzi`)
      }

      s3.upload(params, async function (err: any) {
        if (err) {
          throw err
        }

        try {
          await db.query(`INSERT INTO newspaper_pages (name, page_number, newspaper_id) VALUES ($1, $2, $3)`, [
            pageName,
            index + 1,
            documentId
          ])
          await del(`${pageName}_files`)
          await del(`${pageName}.dzi`)

          res.send({ success: true, documentId })
        } catch (error) {
          console.log(error)
          res.send({ success: false })
        }
      })
    })
}

export default { get, getPublishers, upload }
