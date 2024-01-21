import jwt from 'jsonwebtoken';

const getToken =  ( { uid, email, username, rol, img, status }:any) => {

        var secretKey = "ary16"
        var token = jwt.sign({ uid, email, username, rol, status }, secretKey, {
                expiresIn: "3600m"
        })
        return { token, uid, email, username, rol, img, status }
}

export { getToken }