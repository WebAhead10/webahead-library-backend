const db = require("../../database/connection");

function addTag(req, res) {
    const input = req.body;
    db.query(`SELECT * FROM tags WHERE tag_name=$1`, [input.tag_name])
        .then((result) => {
            //Checking if the tags table has the new added tag, if not we will add it
            if (!result.rows.length) {
                //Adding the tag to the tags table in the database
                db.query(`INSERT INTO tags(tag_name) VALUES ($1)`, [input.tag_name])
                    .then(() => {
                        res.send({
                            success: true,
                            message: "Tag was added successfully"
                        });
                    })
            } else {
                res.send({
                    success: false,
                    message: "Tag is already exist"
                })
            }
        })
}

module.exports = {
    addTag
}