const pg = require("pg")
const dotenv = require("dotenv")

dotenv.config()

const connectionString = process.env.DATABASE_URL
const isProd = connectionString.includes("compute.amazonaws.com")

const db = new pg.Pool({
  connectionString,
  ...(isProd && { ssl: { rejectUnauthorized: false } }),
})

module.exports = db
