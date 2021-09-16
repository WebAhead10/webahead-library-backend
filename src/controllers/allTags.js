const db = require("../../database/connection");

function allTags(req, res) {

    db.query(`SELECT * FROM tags`)
        .then((result) => {
            res.send(
                result.rows.map(data => data.tag_name)
            );
        })
}

module.exports = {
    allTags
}