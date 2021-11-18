import { Request, Response } from 'express'
import db from '../database/connection'
import { Tag } from '../interfaces'

// Adds a tag
const add = async (req: Request, res: Response) => {
  const input = req.body.tag

  try {
    const result = await db.query(`INSERT INTO tags(tag_name) VALUES ($1) RETURNING id`, [input])

    res.send({
      success: true,
      tagId: result.rows[0].id
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || 'Something went wrong'
    })
  }
}

// Fetch all tags
const all = async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM tags')

    res.send({
      success: true,
      data: result.rows.map(({ tag_name, id }: Tag) => ({
        name: tag_name,
        id
      }))
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || 'Something went wrong'
    })
  }
}

// Delete tag from db
const deleteTag = async (req: Request, res: Response) => {
  try {
    const id = req.params.id

    await db.query(`DELETE FROM tags WHERE id=$1`, [id])

    res.send({ success: true })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || 'Something went wrong'
    })
  }
}

// Attach tag to a document
const attachToDocument = async (req: Request, res: Response) => {
  try {
    const data = req.body

    await db.query('INSERT INTO document_tag (document_id, tag_id) VALUES ($1, $2)', [
      data.documentId,
      data.tagId
    ])

    res.send({
      success: true
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || 'Something went wrong'
    })
  }
}

// attach tag to part of the document or overlay
const attachToOverlay = async (req: Request, res: Response) => {
  try {
    const data = req.body

    await db.query(`INSERT INTO overlay_tag (overlay_id, tag_id) VALUES ($1, $2)`, [
      data.overlayId,
      data.tagId
    ])

    res.send({
      success: true
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || 'Something went wrong'
    })
  }
}

// autocomplete tags
const autocomplete = async (req: Request, res: Response) => {
  try {
    const input = req.params.q

    const result = await db.query(`SELECT * FROM tags WHERE tag_name LIKE $1`, [`%${input}%`])

    res.send({
      success: true,
      data: result.rows.map(({ tag_name, id }: Tag) => ({
        name: tag_name,
        id
      }))
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || 'Something went wrong'
    })
  }
}

export default {
  add,
  all,
  delete: deleteTag,
  attachToDocument,
  attachToOverlay,
  autocomplete
}
