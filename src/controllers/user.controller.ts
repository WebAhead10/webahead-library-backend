import { Request, Response } from 'express'
import db from '../database/connection'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { catchAsync } from '../utils'
import config from '../config'


const secret = config.jwtSecret

const add = catchAsync(async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body
  /** role is either: 'normal' or 'advanced' */

  if (!email || !password || !name) {
    throw new Error('Missing data')
  }

  const result = await db.query('SELECT * FROM users WHERE email = $1', [email])

  if (result.rows.length > 0) {
    throw new Error('Email already exists')
  }

  const hash = await bcrypt.hash(password, 10)

  const userResult = await db.query(
    `INSERT INTO users (email, password,name,role) VALUES ($1, $2,$3,$4) RETURNING id`,
    [email, hash, name,role]
  )

  const token = jwt.sign({ id: userResult.rows[0].id }, secret)

  res.status(200).send({
    success: true,
    token
  })
})

const signin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body

  const result = await db.query('SELECT * FROM users WHERE email = $1', [email])

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

export default { add,signin }