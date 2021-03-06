import { Router } from 'express'

import tags from './controllers/tags.controller'
import overlays from './controllers/overlays.controller'
import admin from './controllers/admin.controller'
import newspaper from './controllers/newspapers.controller'
import user from './controllers/user.controller'
import setHistory from './middleware/history'
import verifyToken from './middleware/verifyToken'
import allowRole from './middleware/allowRole'

const router = Router()

router.post('/upload', newspaper.upload)

router.post('/tag/add', tags.add)
router.get('/tag/autocomplete/:q', tags.autocomplete)
router.get('/tag/delete/:id', tags.delete)
router.get('/tag/all', tags.all)
router.post('/tag/attach/document', tags.attachToDocument)
router.post('/tag/attach/overlay', tags.attachToOverlay)

router.get('/newspaper/:id', newspaper.get)
router.post('/newspaper', verifyToken, newspaper.save)
router.get('/publishers', newspaper.getPublishers)
router.post('/publishers/add', verifyToken, newspaper.addPublisher)

router.get('/history/:type', verifyToken, newspaper.getHistory)
router.post('/note', verifyToken, newspaper.addNote, setHistory('add', 'note'))

router.get('/publish/dates/:publisherId', newspaper.getPublishDates)
router.get('/publish/dates/:publisherId/:year/:month', newspaper.getPublishDatesDays)

router.get('/overlay/content/:id', overlays.getText)
router.post('/overlay/content/:id', overlays.setText, setHistory('add', 'tag'))
router.get('/overlay/coords/:id', overlays.getCoords)
router.post('/overlay/coords/:id', verifyToken, overlays.setCoords)
router.delete('/overlay/:overlayId/:coordId', verifyToken, overlays.deleteOverlay)
router.post('/overlay/coords/update/:overlayId', verifyToken, overlays.updateOverlay)
router.post('/admin/signin', admin.signin)
router.post('/admin/add', admin.add)

router.post('/user/add', user.add)
router.post('/user/signin', user.signin)

router.get('/', (req, res) => {
  res.send("Server's homepage, lovely")
})

export default router
