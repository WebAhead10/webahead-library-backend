const db = require("../../database/connection")

function autocomplete(req, res) {
  const input = req.body.tag
  // { tag: 'sport' }

  db.query(`SELECT * FROM tags WHERE tag_name LIKE '%${input}%'`)
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
  autocomplete,
}
