const pg = require('pg')
import config from '../config'

const connectionString: string = config.dbUrl

const isProd = connectionString.includes('compute.amazonaws.com')

const db = new pg.Pool({
  connectionString,
  ...(isProd && { ssl: { rejectUnauthorized: false } })
})

export default db
