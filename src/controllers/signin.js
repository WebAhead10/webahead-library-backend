const db = require("../../database/connection");
const bcrypt = require("bcryptjs");

function signin(req, res) {
    const data = req.body;
    const password = data.password;
      
    db.query(`SELECT * FROM admins WHERE email=$1`, [data.email])
    .then(result => bcrypt.compare(password, result.password))
    .then(match => {
       if (!match){
        res.send({success:false});
        const error = new Error("Incorrect password");
       }
    })
    .catch((error) => {
        res.send({success:false});
        const error = new Error("error");
    });
}

module.exports = {signin};
