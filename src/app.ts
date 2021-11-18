import express from 'express'
import { json, urlencoded } from 'body-parser'
import apiRoutes from './router'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import config from './config'
import { errorConverter, errorHandler } from './middleware/error'
import helmet from 'helmet'
import compression from 'compression'

const app = express()

app.use(helmet())
app.use(compression())
app.use(cors())
app.use(fileUpload())
app.use(json({ limit: '100000kb' }))
app.use(urlencoded({ extended: false }))

app.use('/', apiRoutes)

app.use(errorConverter)

app.use(errorHandler)

const port = config.port || 7000

app.listen(port, () => {
  console.log(`Server run on port http://localhost:${port}`)
})
