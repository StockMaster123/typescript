
import { OAuth2Client } from "google-auth-library";
import { Response } from "express";
import { getUserGoogle, postUserGoogle } from "../controllers/user";


const googleSignUp = async (token:string, res:Response) =>{
    const client = new OAuth2Client();
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '1089952059738-hnrikg96p4hgg826nqdgej6kncosjrkq.apps.googleusercontent.com',
            
        });
        const { email, picture, name }:any = await ticket.getPayload()
        postUserGoogle({ username:name, email, img:picture}, res )
    }
    verify().catch((err)=> console.log(err));
    
}

const googleSignIn = async (token:string, res:Response) =>{
    const client = new OAuth2Client();
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '1089952059738-hnrikg96p4hgg826nqdgej6kncosjrkq.apps.googleusercontent.com', 
        });
        const { email }:any = await ticket.getPayload()
        getUserGoogle(email , res )
    }
    verify().catch((err)=> console.log(err));
    
}

export { googleSignUp, googleSignIn }