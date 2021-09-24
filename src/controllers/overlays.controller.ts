import { Request, Response } from "express"
import db from "../database/connection"
import { Overlay } from "../interfaces/tables"

const getText = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const result = await db.query(
      `SELECT content FROM overlay_coords WHERE id=$1`,
      [id]
    )

    res.send({
      success: true,
      content: result.rows[0].content,
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || "Something went wrong",
    })
  }
}

const setText = async (req: Request, res: Response) => {
  const text = req.body.text
  const id = req.params.id

  try {
    await db.query("UPDATE overlay_coords SET content = $1 WHERE id = $2", [
      text,
      id,
    ])

    res.status(200).send({
      success: true,
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || "Something went wrong",
    })
  }
}

const getCoords = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const result = await db.query(
      `SELECT coords, id FROM overlay_coords WHERE document_id=$1`,
      [id]
    )

    const responseData = result.rows.map((overlays: Overlay) => {
      return {
        id: overlays.id,
        coords: JSON.parse(overlays.coords),
      }
    })

    res.send({
      success: true,
      pages: responseData,
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || "Something went wrong",
    })
  }
}

const setCoords = async (req: Request, res: Response) => {
  const { overlays } = req.body
  const { id } = req.params

  try {
    await db.query(
      "INSERT INTO overlay_coords (coords, document_id , content) VALUES ($1, $2, 'type youre text here') RETURNING coords",
      [JSON.stringify(overlays), id]
    )

    return res.status(200).send({
      success: true,
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || "Something went wrong",
    })
  }
}

export default { getText, setText, getCoords, setCoords }
