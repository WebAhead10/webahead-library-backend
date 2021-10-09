import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import config from '../config'
import { ApiError, logger } from '../utils'
import { ApiErrorType } from '../utils/ApiError'

export interface Error {
  statusCode: number
  message: string
  stack: string
  isOperational: boolean
}

const errorConverter = (
  err: Error | ApiErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR
    const message = error.message || String(httpStatus[statusCode])
    error = new ApiError(statusCode, message, false, err.stack)
  }
  next(error)
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = String(httpStatus[httpStatus.INTERNAL_SERVER_ERROR])
  }

  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    success: false,
    message,
    ...(config.env === 'development' && { stack: err.stack })
  }

  if (config.env === 'development') {
    logger.error(err)
  }

  res.status(statusCode).send(response)
}

export { errorConverter, errorHandler }
