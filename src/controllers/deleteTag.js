const db = require("../../database/connection");

function deleteTag(req, res) {
  const input = req.body.tag_name;
  console.log(input);
  db.query(`DELETE FROM tags WHERE tag_name=$1`, [input])
    .then(() => {
      res.send({
        success: true,
      });
    })
    .catch((error) => {
      res.send({
        success: false,
        message: "Something went wrong",
      });
    });
}

module.exports = {
  deleteTag,
};
