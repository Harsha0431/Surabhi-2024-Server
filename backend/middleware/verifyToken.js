const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_KEY = process.env.JWT_SECRET_KEY;

exports.verifyToken = (token) => {

    if(!token){
        return {code:-1 , message: 'Invalid Token'}
    }

    return jwt.verify(token , JWT_KEY , (err , decoded) =>{
        if(err){
            return {code:-1 , message: err.message}
        }
        const data = decoded.details;
        const id = decoded.id;
        return {code:1 , details: data ,id:id }
    })
}
