const sqlite3 = require("sqlite3").verbose();
const { EncriptarPassword } = require("./HashPassword");

// Conexión a tu base de datos
const db = new sqlite3.Database("../DataBase/BaseDeDatos.db");

async function migrarPasswords() {
    try {
        // 1. Seleccionar todos los usuarios
        db.all("SELECT Id, Password FROM Usuarios", async (err, rows) => {
            if (err) {
                console.error("Error al leer usuarios:", err);
                return;
            }

            for (const usuario of rows) {
                const plainPassword = usuario.Password;

                // Si ya parece un hash (empieza con $2b$ o $2a$), lo dejamos
                if (plainPassword.startsWith("$2b$") || plainPassword.startsWith("$2a$")) {
                    console.log(`Usuario ${usuario.Id} ya tiene hash, se salta.`);
                    continue;
                }

                // 2. Generar hash
                const hashedPassword = await EncriptarPassword(plainPassword);

                // 3. Actualizar la DB
                db.run(
                    "UPDATE Usuarios SET Password = ? WHERE Id = ?",
                    [hashedPassword, usuario.Id],
                    (updateErr) => {
                        if (updateErr) {
                            console.error(`Error al actualizar usuario ${usuario.Id}:`, updateErr);
                        } else {
                            console.log(`Usuario ${usuario.Id} actualizado con hash.`);
                        }
                    }
                );
            }
        });
    } catch (error) {
        console.error("Error en migración:", error);
    }
}

migrarPasswords();
