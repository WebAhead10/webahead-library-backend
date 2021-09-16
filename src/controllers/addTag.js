const db = require("../../database/connection");

function addTag(req, res) {
    const input = req.body;
    db.query(`SELECT * FROM tags WHERE tag_name=$1`, [input.tag_name])
        .then((result) => {
            //Checking if the tags table has the new added tag, if not we will add it
            if (!result.rows.length) {
                //Adding the tag to the tags table in the database
                db.query(`INSERT INTO tags(tag_name) VALUES ($1) RETURNING id`, [input.tag_name])
                    .then((result) => {
                        res.send({
                            success: true,
                            tag_id: result.rows[0].id
                        });
                    })

            } else {
                res.send({
                    success: false,
                    message: "Tag is already exist"
                })
            }
        })
        .catch(error => {
            res.send({
                success: false,
                message: "Something went wrong"
            });
        })
}

module.exports = {
    addTag
}