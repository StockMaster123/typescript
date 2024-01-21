import { Router, Request, Response } from 'express';
import { authGoogle, authUser } from '../controllers/auth';

const auth = Router()

auth.post('/auth', async ( req:Request, res:Response ) => {
    authUser(req, res)
})

auth.post('/auth/google', async ( req:Request, res:Response ) => {
    authGoogle(req, res)
})
export { auth }