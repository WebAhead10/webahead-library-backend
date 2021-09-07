import db from "../../database/connection"

export const getNewspaper = async (req, res) => {
  const { id } = req.params
  try {
    const result = await db.query(
      `SELECT  newspaper_pages.name as pageName, 
                    newspaper_pages.page_number as pageNumber
                    FROM newspapers 
                    LEFT JOIN newspaper_pages ON newspapers.id = newspaper_pages.newspaper_id
                    WHERE newspapers.id = $1
                    ORDER BY newspaper_pages.page_number DESC`,
      [id]
    )

    res.send({
      success: true,
      pages: result.rows,
    })
  } catch (error) {
    console.log(error)
    res.send({ success: false })
  }
}
