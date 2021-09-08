import { Router } from "express"

import { s3Controller } from "./controllers/uploadImageController"
import { getNewspaper } from "./controllers/newspaperController"
import { getCoords } from "./controllers/getCoordsControllers"
import { signInController } from "./controllers/signinController"
import { addadminController } from "./controllers/addAdminController"
import { volunteerSignupController } from "./controllers/volunteerSignupController"
import { publishersController } from "./controllers/publishersControllers"
import { setCoordsController } from "./controllers/setCoordsController"

const router = Router()

router.post("/upload", s3Controller)
router.post("/volunteer/signup", volunteerSignupController)
router.get("/newspaper/:id", getNewspaper)
router.post("/newspaper/coords/:id", setCoordsController)
router.get("/newspaper/coords/:id", getCoords)
router.get("/", (req, res) => {
  res.send("Server's homepage, lovely")
})
router.post("/admin/signin", signInController)
router.post("/admin/signup", addadminController)
router.get("/publishers", publishersController)

export default router
