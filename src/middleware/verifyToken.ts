import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'
import { catchAsync, ApiError } from '../utils'
import db from '../database/connection'
import httpStatus from 'http-status'
const secret = config.jwtSecret
// TOKEN FORMAT: authorization: Bearer <access_token>
const verifyToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  /** extracting token from header */
  // get auth header value
  const header = req.headers.authorization

  // If there is no such header then don't allow him to continue
  if (!header) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not allowed')
  }

  // split at the space and get token from array
  const token = header.split(' ')[1]
  // verify token
  const decoded = <any>jwt.verify(token, secret)
  const userId = decoded.id
  /** get user from DB using the id we got from verifying token */
  const result = await db.query('SELECT * FROM users WHERE id = $1', [userId])

  // if this passes then there is a normal or advanced user in the db
  if (result.length) {
    req.user = result.rows[0]
    next()
    return
  }

  // else we check if and admin exists
  const adminResult = await db.query('SELECT * FROM admins WHERE id = $1', [userId])

  if (adminResult.length) {
    req.user = adminResult.rows[0]
    next()
    return
  }

  // if all of the above fail then send back forbidden
  throw new ApiError(httpStatus.FORBIDDEN, 'Not allowed')
})

export default verifyToken
