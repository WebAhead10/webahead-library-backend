const db = require("../../database/connection.js")

export const publishersController = (req, res) => {
    db.query("SELECT * FROM publishers")
        .then((results) => {

            if (!results.rows.length) {
                return res.status(200).send({
                    success: false,
                    message: "there is no publisher in the database",
                })
            }

            return res.status(200).send({
                success: true,
                message: "success, returning all publishers",
                publisher: results.rows, 
            })
            
        })
        .catch((err) => {
        res.status(403).send({
                success: false,
                message: "Something went wrong",
            })
        })
    }