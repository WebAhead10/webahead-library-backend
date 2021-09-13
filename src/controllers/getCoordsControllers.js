import db from "../../database/connection"

export const getCoords = async (req, res) => {
  const { id } = req.params

  try {
    const result = await db.query(
      `SELECT coords, id FROM overlay_coords WHERE newspaper_id=$1`,
      [id]
    )

    const responseData = result.rows.map((overlays) => {
      return {
        id: overlays.id,
        coords: JSON.parse(overlays.coords),
      }
    })

    res.send({
      success: true,
      pages: responseData,
    })
  } catch (error) {
    console.log(error)
    res.send({ success: false })
  }
}
