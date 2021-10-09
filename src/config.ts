require('dotenv').config()

const envVars = process.env

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  aws: {
    region: envVars.AWS_REGION,
    bucket: envVars.S3_BUCKET || ''
  },
  dbUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || ''
}
