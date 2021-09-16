const db = require("../../database/connection");

function attachTag(req, res) {
    const data = req.body;
    db.query(`INSERT INTO newspaper_tags(newspaper_id, tag_id) VALUES ($1, $2)`, [data.newspaper_id, data.tag_id])
        .then(() => {
            res.send({
                success: true,
                message: "Tag was attached successfully"
            })
        })
        .catch(error => {
            res.send({
                success: false,
                message: "Something went wrong"
            });
        })
}

module.exports = {
    attachTag
}