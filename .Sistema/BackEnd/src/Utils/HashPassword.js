
const Encriptar= require('bcrypt')

const Salto=10;


const EncriptarPassword= async (Password)=>{
    
    const Seguridad= await Encriptar.genSalt(Salto)
    
    return Encriptar.hash(Password,Seguridad)
}

const DesincriptarPassword= async (Password,hash)=>{
    
    return Encriptar.compare(Password,hash)
}

module.exports={EncriptarPassword,DesincriptarPassword}