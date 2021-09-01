const db = require("../../database/connection.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

export const addadminController = (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(200).send({
            success: false,
            message: "Missing data",
        })
    }

    db.query("SELECT * FROM admins WHERE email = $1", [email])
        .then((results) => {
            if (results.rows.length > 0) {
                return res.status(200).send({
                    success: false,
                    message: "Email already exists",
                })
            }
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    throw new Error(err)
                }

                db.query(
                    `INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING id`,
                    [email, hash]
                ).then((result) => {
                    // result.rows[0].id -> the id for the new user
                    const token = jwt.sign(
                        { id: result.rows[0].id },
                        process.env.JWT_SECRET
                    )

                    res.status(200).send({
                        success: true,
                        token,
                    })
                })
            })
        })
        .catch((err) => {
            res.status(200).send({
                success: false,
                message: "Something went wrong",
            })
        })

}