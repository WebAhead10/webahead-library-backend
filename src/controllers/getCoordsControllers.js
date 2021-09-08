import db from "../../database/connection"

export const getCoords = async (req, res) => {
  const { id } = req.params
  console.log(id)
  try {
    const result = await db.query(
      `SELECT coords FROM overlay_coords WHERE id=$1`,
      [id]
    )

    res.send({
      success: true,
      pages: result.rows[0].coords[0],
    })
  } catch (error) {
    console.log(error)
    res.send({ success: false })
  }
}
