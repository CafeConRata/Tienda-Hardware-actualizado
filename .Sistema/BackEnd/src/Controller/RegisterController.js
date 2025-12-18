const db = require('../DataBase/db')
const {GenerarToken} = require('../Utils/Token')
const {EnviarCorreo} = require('../Utils/EnviarEmails')
const {EncriptarPassword} = require('../Utils/HashPassword')

const RegistrarUsuario = async (req,res) =>{
    try{
        const{ User, Name, Password, Email } = req.body

        if(!User || !Name || !Password || !Email) {
            return res.status(400).json({Error: 'Todos los campos son obligatorios'})
        }
        
        const query2 ='SELECT * FROM Usuarios WHERE User = ?'
        db.get(query2, [User], async (Error, Tabla)=>{
            if(Error){
                console.error('Error al buscar al usuario debido a:', Error)
                return res.status(500).json({ message: 'Error Interno: Server'})
            }
            if(Tabla){
                return res.status(409).json({ message: 'El Usuario ya existe'})
            }
        })
        


        const hash = await EncriptarPassword(Password)
        const Token = GenerarToken(Email)
        const query = 'INSERT INTO Usuarios (Id_rol, User, Name, Password, Email) VALUES (?,?,?,?,?)';  

        db.run(query,[3, User, Name, hash, Email], async (Error)=>{
            if(Error){
                console.error(' Error al ejecutar la consulta :',Error)
                return res.status(500).json({ message: 'Error interno del servidor'})
            }
            await EnviarCorreo(Name, Email, Token)
                return res.status(201).json({
                    message:'Usuario Registrado Exitosamente',
                    ID: this.lastID,
                    User: User,
                    Name: Name,
                    Email: Email,
                    Id_rol: 3
                })
        })
    }
    catch(error){
        console.error('Error en el registro del usuario debido a:', error)
        res.status(500).json({Error: 'Error Interno: Server'})

    }

}

module.exports={RegistrarUsuario}