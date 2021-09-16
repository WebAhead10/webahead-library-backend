import {
  Router
} from "express"

import { signin } from "./controllers/signin"
import { signup } from "./controllers/signup"
import { addTag } from "./controllers/addTag"
import { autocomplete } from "./controllers/autocomplete"
import { deleteTag } from "./controllers/deleteTag"
import { allTags } from "./controllers/allTags"
import { attachTag } from "./controllers/attachTag"

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
router.post("/signin", signin)
router.post("/signup", signup)
router.post("/addTag", addTag)
router.post("/autocomplete", autocomplete)
router.delete("/deleteTag", deleteTag)
router.get("/allTags", allTags)
router.post("/attachTag", attachTag)
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