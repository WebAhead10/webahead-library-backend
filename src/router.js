import { Router } from "express"

import { s3Controller } from "./controllers/uploadImageController"
import { getNewspaper } from "./controllers/newspaperController"
import { signin } from "./controllers/signin"
import { signup } from "./controllers/signup"



const router = Router()

router.post("/upload", s3Controller)
router.post("/signin", signin)
router.post("/signup", signup)
router.get("/newspaper/:id", getNewspaper)
router.get("/", (req, res) => {
  res.send("Server's homepage, lovely")
})

export default router
