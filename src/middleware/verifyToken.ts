
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'
import { catchAsync } from '../utils'
import db from '../database/connection'
const secret = config.jwtSecret
// TOKEN FORMAT: authorization: Bearer <access_token>
const verifyToken = async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    /** extracting token from header */ 
        // get auth header value
        const header = req.headers.authorization;
        // check if header is  undefined
        if(header){
            // split at the space and get token from array
            const token = header.split(' ')[1];
           // verify token
           try{
            const decoded = <any>jwt.verify(token,secret)
            console.log("decoded",decoded)
            const userId = decoded.id;
            /** get user from DB using the id we got from verifying token */
           const result = await db.query('SELECT * FROM users WHERE id = $1', [userId])
           req.user = result.rows[0];
             next();
           }catch{
            // forbidden
            res.sendStatus(403);
           }
          
           }
           
        }
            
        
   


export { verifyToken }