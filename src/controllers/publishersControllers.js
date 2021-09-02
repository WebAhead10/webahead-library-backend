const db = require("../../database/connection.js")

export const publishersController = (req, res) => {
    const { publisher_id } = req.params

    db.query("SELECT * FROM publishers WHERE id = $1", [publisher_id])
        .then((results) => {

            if (!results.rows.length) {
                return res.status(200).send({
                    success: false,
                    message: "id not found! this publisher doesnt exist",
                })
            }

            return res.status(200).send({
                success: true,
                message: "id has been found! returning publisher",
                publisher: results.rows[0], 

            })
            
        })
        .catch((err) => {
        res.status(403).send({
                success: false,
                message: "Something went wrong",
            })
        })
    }