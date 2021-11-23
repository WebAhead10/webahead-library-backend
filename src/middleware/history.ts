import { Request, Response, NextFunction } from 'express'
import { ApiError, catchAsync } from '../utils'
import db from '../database/connection'
import httpStatus from 'http-status'

const setHistory = (operation: string, dataChangeType: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { text, user_id, document_id } = req.body

    //this should be changed to user type ('normal','advanced','admin') after login is working
    const userType = 'normal'

    await db.query(
      'INSERT INTO documents_history (change_data,user_id,data_id,data_change,user_roll,operation) VALUES ($1,$2,$3,$4,$5,$6)',
      [text, user_id, document_id, dataChangeType, userType, operation]
    )
    res.status(httpStatus.OK).send({ success: true })
  })

export default setHistory
