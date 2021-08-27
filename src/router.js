import { Router } from "express"

import { s3Controller } from "./controllers/uploadImageController"
import { getNewspaper } from "./controllers/newspaperController"

const router = Router()

router.post("/upload", s3Controller)
router.get("/newspaper/:id", getNewspaper)
router.get("/", (req, res) => {
  res.send("Server's homepage, lovely")
})

export default router
