import { Request, Response, NextFunction } from 'express'
import db from '../database/connection'
import { Overlay } from '../interfaces'
import { ApiError, catchAsync } from '../utils'
import httpStatus from 'http-status'

const getText = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const result = await db.query(`SELECT content FROM overlays WHERE id=$1`, [id])

    if (!result.rows.length) {
      return res.send({
        success: false,
        message: 'Overlay does not exist'
      })
    }

    res.send({
      success: true,
      content: result.rows[0].content
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || 'Something went wrong'
    })
  }
}

const setText = async (req: Request, res: Response, next: NextFunction) => {
  console.log('this is the correct place ', req.body)
  const { text, user_id, document_id } = req.body
  // const text = req.body.text
  const id = req.params.id

  // try {
  await db.query('UPDATE overlays SET content = $1 WHERE id = $2', [text, id])

  req.historyBody = {
    userId: user_id
  }

  req.historyResponse = {
    status: httpStatus.OK,
    body: { success: true }
  }

  next()
  //   res.status(200).send({
  //     success: true
  //   })
  // } catch (error: any) {
  //   res.send({
  //     success: false,
  //     message: error.message || 'Something went wrong'
  //   })
  // }
}

const getCoords = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const result = await db.query(`SELECT coords, id FROM overlays WHERE document_id=$1`, [id])

    const responseData = result.rows.map((overlays: Overlay) => {
      return {
        id: overlays.id,
        coords: JSON.parse(overlays.coords)
      }
    })

    res.send({
      success: true,
      pages: responseData
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || 'Something went wrong'
    })
  }
}

// An overlay can made up of multiple coords, think about an article
// in a newspaper split between 2 pages.
const setCoords = async (req: Request, res: Response) => {
  const { overlays } = req.body
  const { id } = req.params

  try {
    await db.query(
      "INSERT INTO overlays (coords, document_id , content) VALUES ($1, $2, '') RETURNING coords",
      [JSON.stringify(overlays), id]
    )

    return res.status(200).send({
      success: true
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || 'Something went wrong'
    })
  }
}

const deleteOverlay = catchAsync(async (req: Request, res: Response) => {
  const coordId = req.params.coordId
  const overlayId = req.params.overlayId

  const overlaysRes = await db.query('SELECT * FROM overlays WHERE id = $1', [overlayId])

  const coords = JSON.parse(overlaysRes.rows[0].coords)
  const newCoords = coords.filter(({ id }: { id: string }) => id !== coordId)

  await db.query('UPDATE overlays SET coords = $1 WHERE id = $2', [
    JSON.stringify(newCoords),
    overlayId
  ])

  return res.status(200).send({
    success: true
  })
})

const updateOverlay = catchAsync(async (req: Request, res: Response) => {
  const overlayId = req.params.overlayId
  const data = req.body.overlays

  const overlaysRes = await db.query('SELECT * FROM overlays WHERE id = $1', [overlayId])

  const coords = JSON.parse(overlaysRes.rows[0].coords)
  const newCoords = coords.concat(data)

  await db.query('UPDATE overlays SET coords = $1 WHERE id = $2', [
    JSON.stringify(newCoords),
    overlayId
  ])

  return res.status(200).send({
    success: true
  })
})

export default { getText, setText, getCoords, setCoords, deleteOverlay, updateOverlay }
