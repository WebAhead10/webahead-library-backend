import {
  Router
} from "express"

import {
  s3Controller
} from "./controllers/uploadImageController"
import {
  getNewspaper
} from "./controllers/newspaperController"
import {
  signin
} from "./controllers/signin"
import {
  signup
} from "./controllers/signup"
import {
  addTag
} from "./controllers/addTag"
import {
  autocomplete
} from "./controllers/autocomplete"
import {
  deleteTag
} from "./controllers/deleteTag"
import {
  allTags
} from "./controllers/allTags"
import {
  attachTag
} from "./controllers/attachTag"



const router = Router()

router.post("/upload", s3Controller)
router.post("/signin", signin)
router.post("/signup", signup)
router.post("/addTag", addTag)
router.post("/autocomplete", autocomplete)
router.delete("/deleteTag", deleteTag)
router.get("/allTags", allTags)
router.post("/attachTag", attachTag)


router.get("/newspaper/:id", getNewspaper)
router.get("/", (req, res) => {
  res.send("Server's homepage, lovely")
})

export default router