const db = require("../../database/connection.js")

export const updateArticleController = (req, res) => {
    const text  = req.body.text
    const id =  req.params.id
    
    db.query("UPDATE overlay_coords SET content = $1 WHERE id = $2", [text,id])
        .then(() => {
            res.status(200).send({
                success: true,
                message: "The text value has been changed successfully!"
            })
        })
        .catch((err) => {
            res.status(200).send({
                success: false,
                message: err,
            })
        })
}