import { Request, Response } from 'express'
import db from '../database/connection'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { catchAsync } from '../utils'
import config from '../config'

const secret = config.jwtSecret

const add = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new Error('Missing data')
  }

  const result = await db.query('SELECT * FROM admins WHERE email = $1', [email])

  if (result.rows.length > 0) {
    throw new Error('Email already exists')
  }

  const hash = await bcrypt.hash(password, 10)

  const adminResult = await db.query(
    `INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING id`,
    [email, hash]
  )

  const token = jwt.sign({ id: adminResult.rows[0].id }, secret)

  res.status(200).send({
    success: true,
    token
  })
})

const signin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body

  const result = await db.query('SELECT * FROM admins WHERE email = $1', [email])

  if (!result.rows.length) {
    throw new Error('Email does not exist')
  }

  const user = result.rows[0]

  const isCorrect = await bcrypt.compare(password, user.password)

  if (!isCorrect) {
    throw new Error('Incorrect password')
  }

  const token = jwt.sign({ id: user.id }, secret)

  res.status(200).send({
    success: true,
    token
  })
})

export default { add, signin }
