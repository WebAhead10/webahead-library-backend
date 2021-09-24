import { Request, Response } from "express"
import db from "../database/connection"

const signup = async (req: Request, res: Response) => {
  try {
    await 1
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || "Something went wrong",
    })
  }
}

const signin = async (req: Request, res: Response) => {
  try {
    await 1
  } catch (error: any) {
    res.send({
      success: false,
      message: error.message || "Something went wrong",
    })
  }
}

export default { signin, signup }
