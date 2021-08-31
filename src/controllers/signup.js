const db = require("../../database/connection");
const bcrypt = require("bcryptjs");

function signup(req,res) {
    const data = req.body;
    const password = data.password;
    bcrypt
  .genSalt(10)
  .then((salt) => bcrypt.hash(password, salt))
  .then((hash) => {
    console.log(hash);
    db.query(`SELECT * FROM admins WHERE email=$1`, [data.email])
    .then((data) => {
      if (!data.rows.length) {
          db.query(`INSERT INTO admins(email,password) VALUES ($1, $2)`, [data.email,hash])
          .then((result) => {
              res.send({success:true});
            })
      
            .catch((error) => {
              console.log(error);
            });

      } else {
          res.send({success:false});
      }  
  })
})
}

module.exports={signup};