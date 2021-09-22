const db = require("../../database/connection")

function addTag(req, res) {
  const input = req.body.tag
  // { tag: 'sport' }

  db.query(`SELECT * FROM tags WHERE tag_name=$1`, [input])
    .then((result) => {
      //Checking if the tags table has the new added tag, if not we will add it
      if (!result.rows.length) {
        //Adding the tag to the tags table in the database
        db.query(`INSERT INTO tags(tag_name) VALUES ($1) RETURNING id`, [
          input,
        ]).then((result) => {
          res.send({
            success: true,
            tagId: result.rows[0].id,
          })
        })
      } else {
        res.send({
          success: false,
          message: "Tag is already exist",
        })
      }
    })
    .catch((error) => {
      res.send({
        success: false,
        message: "Something went wrong",
      })
    })
}

module.exports = {
  addTag,
}
