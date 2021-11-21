
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'
import { catchAsync } from '../utils'
import db from '../database/connection'
const secret = config.jwtSecret
// TOKEN FORMAT: authorization: Bearer <access_token>
const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    /** extracting token from header */ 
        // get auth header value
        const header = req.headers['authorization'];
        // check if header is  undefined
        if(typeof header !== 'undefined'){
            // split at the space and get token from array
            const token = header.split(' ')[1];
           // verify token
           jwt.verify(token,secret,async (err,data)=>{
               if(err){
                   console.log(err);
                   res.sendStatus(403);
               }else{
                   if(data){
                    const user_id = data.id;
                     /** get user from DB using the id we got from verifying token */
                    const result = await db.query('SELECT * FROM users WHERE id = $1', [user_id])
                    req.user = result.rows;
                   }
                 
                next();
               }
           })
            
        }else{
            // forbidden
            res.sendStatus(403);
        }
   
}

export { verifyToken }