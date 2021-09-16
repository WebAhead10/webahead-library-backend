const db = require("../../database/connection");

function autocomplete(req, res) {
    const input = req.body;
    db.query(`SELECT * FROM tags WHERE tag_name LIKE '%${input.tag_name}%'`)
        .then((result) => {
            res.send(
                result.rows.map(data => data.tag_name)
            );
        })
}

module.exports = {
    autocomplete
}