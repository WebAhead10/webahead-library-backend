const db = require("../../database/connection")

function allTags(req, res) {
  db.query(`SELECT * FROM tags`)
    .then((result) => {
      res.send({
        success: true,
        data: result.rows.map((data) => ({ name: data.tag_name, id: data.id })),
      })
    })
    .catch((error) => {
      res.send({
        success: false,
        message: "Something went wrong",
      })
    })
}

module.exports = {
  allTags,
}
