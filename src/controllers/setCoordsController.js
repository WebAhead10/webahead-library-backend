const db = require("../../database/connection.js")

export const setCoordsController = (req, res) => {
  const { overlays } = req.body

  db.query(
    "INSERT INTO overlay_coords (coords, newspaper_id) VALUES ($1, $2) RETURNING coords",
    [JSON.stringify(overlays), req.params.id]
  )
    .then((results) => {
      return res.status(200).send({
        success: true,
        message: "success, returning all coords",
        coords: results.rows,
      })
    })
    .catch((err) => {
      res.status(403).send({
        success: false,
        message: "Something went wrong",
      })
    })
}
