import jwt from 'jsonwebtoken';

const getToken =  ( { uid, email, username, rol, img, status, socketId, stripeId }:any) => {

        var secretKey = "ary16"
        var token = jwt.sign({ uid, email, username, rol, status, socketId, stripeId }, secretKey, {
                expiresIn: "3600m"
        })
        return { token, uid, email, username, rol, img, status, socketId, stripeId }
}

export { getToken }