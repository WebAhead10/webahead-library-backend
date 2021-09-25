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
router.post("/tag/attach/overlay", tags.attachToOverlay)

router.get("/newspaper/:id", newspaper.get)
router.get("/publishers", newspaper.getPublishers)

router.get("/overlay/content/:id", overlays.getText)
router.post("/overlay/content/:id", overlays.setText)
router.get("/overlay/coords/:id", overlays.getCoords)
router.post("/overlay/coords/:id", overlays.setCoords)

router.post("/admin/signin", admin.signin)
router.post("/admin/add", admin.add)

router.get("/", (req, res) => {
  res.send("Server's homepage, lovely")
})
export default router
