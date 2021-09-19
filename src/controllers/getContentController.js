import db from "../../database/connection"

export const getContentController = async (req, res) => {
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

  } catch (error) {
    console.log(error)
    res.send({ success: false })
  }
}
