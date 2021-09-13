import db from "../../database/connection"

export const getCoords = async (req, res) => {
  const { id } = req.params
  try {
    const result = await db.query(
      `SELECT id , coords FROM overlay_coords WHERE newspaper_id = $1`,
      [id]
    )

    res.send({
      success: true,
      coordsData: result.rows,
    })
  } catch (error) {
    console.log(error)
    res.send({ success: false })
  }
}
