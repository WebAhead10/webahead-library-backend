import { Request, Response } from 'express'
import db from '../database/connection'
import * as aws from 'aws-sdk'
import sharp from 'sharp'
import del from 'del'
import fs from 'fs'
import path from 'path'
import { IRandomKeys, Tag, Newspaper } from '../interfaces'
import config from '../config'
import { ApiError, catchAsync } from '../utils'
import httpStatus from 'http-status'
const moment = require('moment')

aws.config.region = config.aws.region

const get = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  const result = await db.query(
    `SELECT newspaper_pages.name as pageName, 
            newspaper_pages.page_number as pageNumber,
            newspapers.newspaper_key as newspaperKey
            FROM newspapers 
            LEFT JOIN newspaper_pages ON newspapers.id = newspaper_pages.newspaper_id
            WHERE newspapers.id = $1
            ORDER BY newspaper_pages.page_number DESC`,
    [id]
  )

  res.send({ success: true, pages: result.rows })
})

const getPublishers = catchAsync(async (req: Request, res: Response) => {
  const result = await db.query('SELECT * FROM publishers')

  return res.status(httpStatus.OK).send({
    success: true,
    publisher: result.rows
  })
})

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
  let S3_BUCKET = config.aws.bucket

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
      const insertResult = await db.query(
        'INSERT INTO newspapers (newspaper_key) VALUES ($1) RETURNING id',
        [documentName]
      )

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
          Key: `documents/${documentName}/${pageName}/${pageName}_files/${bucketPath}`,
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
        Key: `documents/${documentName}/${pageName}/${pageName}.dzi`,
        Body: fs.readFileSync(`${pageName}.dzi`)
      }

      s3.upload(params, async function (err: any) {
        if (err) {
          throw err
        }

        try {
          await db.query(
            `INSERT INTO newspaper_pages (name, page_number, newspaper_id) VALUES ($1, $2, $3)`,
            [pageName, index + 1, documentId]
          )
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

const save = catchAsync(async (req: Request, res: Response) => {
  const { date, documentId, publisher, tags } = req.body

  await db.query('UPDATE newspapers SET publisher_id = $1, published_date = $2 WHERE id = $3', [
    publisher,
    date,
    documentId
  ])

  await Promise.all(
    tags.map(({ id }: Tag) =>
      db.query('INSERT INTO document_tag (document_id, tag_id) VALUES ($1, $2)', [documentId, id])
    )
  )

  res.send({ success: true })
})

const addPublisher = catchAsync(async (req: Request, res: Response) => {
  const { name, logo } = req.body

  if (!name || !logo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing data')
  }

  await db.query('INSERT INTO publishers (name, logo) VALUES ($1, $2)', [name, logo])

  res.status(httpStatus.OK).send({ success: true })
})

const monthNumberToName: IRandomKeys = {
  '01': 'يناير',
  '02': 'فبراير',
  '03': 'مارس',
  '04': 'ابريل',
  '05': 'مايو',
  '06': 'يونيو',
  '07': 'يوليو',
  '08': 'أغسطس',
  '09': 'سبتمبر',
  '10': 'أكتوبر',
  '11': 'نوفمبر',
  '12': 'ديسامبر'
}

const monthNameToNumber: IRandomKeys = {
  يناير: '01',
  فبراير: '02',
  مارس: '03',
  ابريل: '04',
  مايو: '05',
  يونيو: '06',
  يوليو: '07',
  أغسطس: '08',
  سبتمبر: '09',
  أكتوبر: '10',
  نوفمبر: '11',
  ديسامبر: '12'
}

// Takes a publisherId and returns all of the newspapers for that publisher
const getPublishDates = catchAsync(async (req: Request, res: Response) => {
  const { publisherId } = req.params

  if (!publisherId) throw new ApiError(httpStatus.BAD_REQUEST, 'Publisher id not provided')

  const dbRes = await db.query('SELECT * FROM newspapers WHERE publisher_id = $1', [publisherId])

  if (!dbRes.rows.length) throw new ApiError(httpStatus.BAD_REQUEST, 'Publisher does not exist')

  let yearsMonth: { [key: string]: string[] } = {}

  dbRes.rows.forEach(({ published_date }: Newspaper) => {
    const date = published_date.toISOString().split('T')[0]
    const [year, monthRaw] = date.split('-')

    if (!yearsMonth[year]) {
      yearsMonth[year] = []
    }

    if (!yearsMonth[year].includes(monthRaw)) {
      yearsMonth[year] = yearsMonth[year].concat(monthRaw)
      yearsMonth[year].sort()
    }
  })

  Object.keys(yearsMonth).forEach((year) => {
    yearsMonth[year] = yearsMonth[year].map((month: string) => monthNumberToName[month])
  })

  res.status(httpStatus.OK).send({ success: true, data: yearsMonth })
})

// Takes publisherId, year and month through the params and returns the days where there
// are published newspapers in that month
const getPublishDatesDays = catchAsync(async (req: Request, res: Response) => {
  const { publisherId, year, month } = req.params

  if (!publisherId || !year || !month)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing data to process the request')

  const dateStart = `${year}-${monthNameToNumber[month]}-01`
  const lastDayOfMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth()
  const dateEnd = `${year}-${monthNameToNumber[month]}-${lastDayOfMonth}`

  const dbRes = await db.query(
    'SELECT * FROM newspapers WHERE publisher_id = $1 AND published_date between $2 and $3',
    [publisherId, dateStart, dateEnd]
  )

  const publishedDays = dbRes.rows.map(({ id, published_date }: Newspaper) => ({
    id,
    day: published_date.toISOString().split('T')[0].split('-')[2]
  }))

  res.status(httpStatus.OK).send({ success: true, data: publishedDays })
})

export default {
  get,
  getPublishers,
  upload,
  save,
  addPublisher,
  getPublishDates,
  getPublishDatesDays
}
