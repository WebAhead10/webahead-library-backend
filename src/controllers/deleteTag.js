const db = require("../../database/connection")

function deleteTag(req, res) {
  db.query(`DELETE FROM tags WHERE id=$1`, [req.body.id])
    .then(() => {
      res.send({
        success: true,
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
  deleteTag,
}
