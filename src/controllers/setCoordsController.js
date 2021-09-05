const db = require("../../database/connection.js")

export const setCoordsController = (req, res) => {
  const coords  = req.body
    console.log(coords)
    db.query( "INSERT INTO overlay_coords (coords) VALUES ($1) RETURNING coords",
    [coords])
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