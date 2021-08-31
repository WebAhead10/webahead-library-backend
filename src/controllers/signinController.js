const db = require("../../database/connection.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

export const signInController = (req, res) => {
    const { email, password } = req.body


    db.query("SELECT * FROM admins WHERE email = $1", [email])
        .then((results) => {
            //
            if (results.rows.length === 0) {
                return res.status(403).send({
                    success: false,
                    message: "Email does not exist",
                })
            }
            //
            const user = results.rows[0]

            bcrypt.compare(password, user.password, (err, isCorrect) => {
                if (err || !isCorrect) {
                    return res.status(403).send({
                        success: false,
                        message: "Incorrect password",
                    })
                }

                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)

                res.status(200).send({
                    success: true,
                    token,
                })
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({
                success: false,
                message: "Wrong!",
            })

        })
}