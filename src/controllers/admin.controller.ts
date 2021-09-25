import { Request, Response } from "express"
import db from "../database/connection"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const secret = process.env.JWT_SECRET || ""

const add = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(200).send({
      success: false,
      message: "Missing data",
    })
  }

  try {
    const result = await db.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ])

    if (result.rows.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Email already exists",
      })
    }

    const hash = await bcrypt.hash(password, 10)

    const adminResult = await db.query(
      `INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING id`,
      [email, hash]
    )

    const token = jwt.sign({ id: adminResult.rows[0].id }, secret)

    res.status(200).send({
      success: true,
      token,
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || "Something went wrong",
    })
  }
}

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const result = await db.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ])

    if (!result.rows.length) {
      return res.status(403).send({
        success: false,
        message: "Email does not exist",
      })
    }

    const user = result.rows[0]

    const isCorrect = await bcrypt.compare(password, user.password)

    if (!isCorrect) {
      return res.status(403).send({
        success: false,
        message: "Incorrect password",
      })
    }

    const token = jwt.sign({ id: user.id }, secret)

    res.status(200).send({
      success: true,
      token,
    })
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || "Something went wrong",
    })
  }
}

export default { add, signin }
