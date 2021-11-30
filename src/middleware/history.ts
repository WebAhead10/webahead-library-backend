import { Request, Response, NextFunction } from 'express'
import { ApiError, catchAsync } from '../utils'
import db from '../database/connection'
import httpStatus from 'http-status'

const setHistory = (changeOperation: string, entityType: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, document_id } = req.body
    const { status, body } = req.historyResponse
    // console.log(req.body)

    //this should be changed to user type ('normal','advanced','admin') after login is working
    const userType = 'normal'

    await db.query(
      `INSERT INTO documents_history 
        (req_body, user_id, entity_id, entity_type, user_role, entity_change_operation) 
        VALUES ($1, $2, $3, $4, $5, $6)`,
      [req.historyBody, user_id, document_id, entityType, userType, changeOperation]
    )

    res.status(status).send(body)
  })

export default setHistory
