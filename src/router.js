import { Router } from "express"

import { s3Controller } from "./controllers/uploadImageController"
import { getNewspaper } from "./controllers/newspaperController"
import { signInController } from "./controllers/signinController"
import { addadminController } from "./controllers/addAdminController"
import { volunteerSignupController } from "./controllers/volunteerSignupController"

const router = Router()

router.post("/upload", s3Controller)
router.post("/volunteer/signup", volunteerSignupController)
router.get("/newspaper/:id", getNewspaper)
router.get("/", (req, res) => {
  res.send("Server's homepage, lovely")
})
router.post("/admin/signin", signInController)
router.post("/admin/signup", addadminController)

export default router
