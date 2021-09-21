const db = require("../../database/connection");

function autocomplete(req, res) {
    const input = req.body;
    db.query(`SELECT * FROM tags WHERE tag_name LIKE '%${input.tag_name}'`)
        .then((result) => {
            res.send({
                success: true,
                data: result.rows.map(data => data.tag_name)
            });
        })
        .catch(error => {
            res.send({
                success: false,
                message: "Something went wrong"
            });
        })
}

module.exports = {
    autocomplete
}