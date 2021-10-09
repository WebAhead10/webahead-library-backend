import { Request, Response } from 'express'
import db from '../database/connection'
import { Overlay } from '../interfaces'

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

const setText = async (req: Request, res: Response) => {
  const text = req.body.text
  const id = req.params.id

  try {
    await db.query('UPDATE overlays SET content = $1 WHERE id = $2', [text, id])

    res.status(200).send({
      success: true
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || 'Something went wrong'
    })
  }
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

export default { getText, setText, getCoords, setCoords }
