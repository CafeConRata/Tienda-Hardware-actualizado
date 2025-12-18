const db = require('../DataBase/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function Login(req, res) {
    const { Email, Password } = req.body;

    try {

        if (!Email || !Password) {
            return res.status(400).json({ error: "Email y contraseña son obligatorios" });
        }
        // 1. Buscar usuario
        const sql = "SELECT * FROM Usuarios WHERE Email = ?";
        db.get(sql, [Email], async (error, usuario) => {
            if (error) return res.status(500).json({ error: "Error en el servidor" });

            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            // 2. Validar contraseña
            const PasswordValida = await bcrypt.compare(Password, usuario.Password);

            if (!PasswordValida) {
                return res.status(401).json({ error: "Contraseña incorrecta" });
            }

            // 3. Revisar si el email está verificado
            if (usuario.verificado === 0) {
                return res.status(401).json({ error: "Debes verificar tu email antes de iniciar sesión" });
            }

            // 4. Crear token JWT
            const token = jwt.sign(
                { Id: usuario.Id, Email: usuario.Email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                mensaje: "Login exitoso",
                token: token,
                usuario: {
                    id: usuario.Id,
                    nombre: usuario.Name,    
                    rol: usuario.Id_rol
                }
            });
        });

    } catch (error) {
        return res.status(500).json({ error: "Error al iniciar sesión" });
    }
}

module.exports = { Login };