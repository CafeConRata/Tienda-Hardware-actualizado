import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // 🔹 Importar SweetAlert2
import "../style/Formularios.css";
import { Link } from "react-router-dom";

export default function Register() {
    const [User, setUser] = useState("");
    const [Email, setEmail] = useState("");
    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const Router = await axios.post("http://localhost:3000/api/RegistrarUser", {
                User,
                Name,
                Password,
                Email,
            });

            // 🔹 SweetAlert de éxito
            Swal.fire({
                icon: "success",
                title: "Registro exitoso",
                text: Router.data.message || "Datos registrados correctamente ✅",
                confirmButtonColor: "#3b82f6",
            });

            // limpiar campos
            setPassword("");
            setUser("");
            setName("");
            setEmail("");
        } catch (error) {
            console.error("Error al registrar usuario:", error);

            // 🔹 SweetAlert de error
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo registrar el usuario ❌",
                confirmButtonColor: "#ef4444",
            });
        }
    };

    return (
        <div className="form-container">
            <h2>Crear Cuenta</h2>
            <form onSubmit={handleSubmit} className="form-box">
                <input
                    type="text"
                    value={User}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Usuario"
                    required
                />
                <input
                    type="email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    required
                />
                <input
                    type="text"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre completo"
                    required
                />
                <input
                    type="password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                <button type="submit">Registrar</button>
            </form>

            <div className="registration-footer">
                <p className="footer-text">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/LoginForm" className="footer-link">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
