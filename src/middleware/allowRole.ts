import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../utils'
import ApiError from '../utils/ApiError'
import httpStatus from 'http-status'

import db from '../database/connection'

const allowRole = function (role: string) {
  return catchAsync(async function (req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id
    // look up the user from admins table
    const result = await db.query('SELECT * FROM admins WHERE id = $1', [userId])
    const adminInDB = result.rows[0]
    // if found the user in admins DB
    if (adminInDB) {
      next()
    } else {
      // if not found
      // look up the user from users table
      const result = await db.query('SELECT * FROM users WHERE id = $1', [userId])
      const userInDB = result.rows[0]
      // if found user in the users DB
      if (userInDB) {
        // check if don't roles match to send an error
        if (userInDB.role !== role) {
          throw new ApiError(httpStatus.FORBIDDEN, 'Not allowed')
        }

        next()
      }
    }
  })
}

export default allowRole
