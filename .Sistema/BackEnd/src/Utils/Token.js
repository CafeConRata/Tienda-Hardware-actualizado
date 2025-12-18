const jwt = require('jsonwebtoken')
require('dotenv').config();

function GenerarToken (Email){
 return jwt.sign({Email}, process.env.JWT_SECRET,{expiresIn: "1d" })
}

function VerificarToken (TokenEmail){
    return jwt.verify(TokenEmail, process.env.JWT_SECRET)        
}

module.exports={GenerarToken, VerificarToken}