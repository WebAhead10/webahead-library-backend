import { Router } from "express"

import tags from "./controllers/tags.controller"
import overlays from "./controllers/overlays.controller"
import admin from "./controllers/admin.controller"
import newspaper from "./controllers/newspapers.controller"

const router = Router()

router.post("/upload", newspaper.upload)

router.post("/tag/add", tags.add)
router.get("/tag/autocomplete/:q", tags.autocomplete)
router.get("/tag/delete/:id", tags.delete)
router.get("/tag/all", tags.all)
router.post("/tag/attach/document", tags.attachToDocument)

router.get("/newspaper/:id", newspaper.get)
router.get("/publishers", newspaper.getPublishers)

router.get("/newspaper/content/:id", overlays.getText)
router.post("/newspaper/coords/:id", overlays.setText)
router.get("/newspaper/coords/:id", overlays.getCoords)
router.put("/update/article/:id", overlays.setCoords)

router.post("/admin/signin", admin.signin)
router.post("/admin/signup", admin.add)

router.get("/", (req, res) => {
  res.send("Server's homepage, lovely")
})
export default router
