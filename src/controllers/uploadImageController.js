import * as aws from "aws-sdk"
import sharp from "sharp"
import del from "del"
import fs from "fs"
import path from "path"
import db from "../../database/connection"

require("dotenv").config()

aws.config.region = process.env.AWS_REGION

export const s3Controller = async (req, res) => {
  // newspaperName should include the date in it
  const {
    file,
    index,
    newspaperName,
    isNewPage,
    published_date,
    publisher_id,
  } = req.body

  let fileContent = Buffer.from(
    file.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  )

  const s3 = new aws.S3({ signatureVersion: "v4" })
  let S3_BUCKET = process.env.S3_BUCKET

  const pageName = `${newspaperName}_page_${index + 1}`
  var newspaperId

  try {
    const result = await db.query(
      `SELECT * FROM newspapers 
        WHERE published_date = $1 AND publisher_id = $2 `,
      [published_date, publisher_id]
    )

    // If the newspaper exists
    if (result.rows.length && !isNewPage) {
      return res.send({
        success: false,
        message: "Already exists",
      })

      // If it's a new page from the newspaper
    } else if (isNewPage) {
      newspaperId = result.rows[0].id

      // Add new newspaper
    } else {
      const insertResult = await db.query(
        "INSERT INTO newspapers (published_date, publisher_id) VALUES ($1, $2) RETURNING id",
        [published_date, publisher_id]
      )

      newspaperId = insertResult.rows[0].id
    }
  } catch (error) {
    console.log(error)
    return res.send({
      success: false,
      message: "Failed",
    })
  }

  console.log({ newspaperId })

  sharp(fileContent)
    .tile({
      size: 256,
    })
    .toFile(`${pageName}.dz`, (err) => {
      if (err) {
        console.log(err)
        return
      }

      const walkSync = (currentDirPath, callback) => {
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

      walkSync(`${pageName}_files`, async (filePath) => {
        let bucketPath = filePath.substring(`${pageName}_files`.length + 1)
        let params = {
          Bucket: S3_BUCKET,
          Key: `misc/${newspaperName}/${pageName}/${pageName}_files/${bucketPath}`,
          Body: fs.readFileSync(filePath),
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
        Key: `misc/${newspaperName}/${pageName}/${pageName}.dzi`,
        Body: fs.readFileSync(`${pageName}.dzi`),
      }

      s3.upload(params, async function (err, data) {
        if (err) {
          throw err
        }

        try {
          await db.query(
            `INSERT INTO newspaper_pages (name, page_number, newspaper_id) VALUES ($1, $2, $3)`,
            [pageName, index + 1, newspaperId]
          )
          await del(`${pageName}_files`)
          await del(`${pageName}.dzi`)

          res.send({ success: true, newspaperId })
        } catch (error) {
          console.log(error)
          res.send({ success: false })
        }
      })
    })
}
