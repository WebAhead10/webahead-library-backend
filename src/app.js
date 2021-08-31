import express from "express"
import { json, urlencoded } from "body-parser"
import apiRoutes from "./router"
import cors from "cors"
import fileUpload from "express-fileupload"

const app = express()

app.use(cors())
app.use(fileUpload())
app.use(json({ limit: "100000kb" }))
app.use(urlencoded({ extended: false }))

app.use("/", apiRoutes)

const port = process.env.PORT || 7000

app.listen(port, () => {
  console.log(`Server run on port http://localhost:${port}`)
})
