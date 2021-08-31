const db = require("../../database/connection");
const bcrypt = require("bcryptjs");

function signin(req, res) {
    const data = req.body;
    const password = data.password;
      
    db.query(`SELECT * FROM admins WHERE email=$1`, [data.email])
    .then(result => bcrypt.compare(password, result.password))
    .then(match => {
       if (!match) throw new Error("Password mismatch");
    })
    .catch((error) => {
        console.log("error");
    });
}

module.exports = {signin};
