import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../style/Catalogo.css";
import { Link } from "react-router-dom";

export default function LoginForm() {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:3000/api/login", {
                Email,
                Password,
            });
            
            // 🔹 Ahora guardamos token y usuario con rol
            const { token, mensaje, usuario } = response.data;
            localStorage.setItem("authToken", token);
            localStorage.setItem("user", JSON.stringify(usuario));

            Swal.fire({
                icon: "success",
                title: "¡Bienvenido!",
                text: mensaje || "Inicio de sesión exitoso",
                confirmButtonColor: "#3085d6",
            }).then(() => {
                navigate("/Inicio"); // Redirige a la ruta correcta
            });
        } catch (err) {
            setError(err.response?.data?.error || "Error al iniciar sesión");

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err.response?.data?.error || "Error al iniciar sesión",
                confirmButtonColor: "#d33",
            });
        }
    };

    return (
        <div className="form-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin} className="form-box">
                <input
                    type="email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    required
                />
                <input
                    type="password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                <button type="submit">Entrar</button>
            </form>

            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            <div className="registration-footer">
                <p className="footer-text">
                    ¿No tienes una Cuenta?{" "}
                    <Link to="/RegistrarUser" className="footer-link">
                        Crear Cuenta
                    </Link>
                </p>
            </div>
        </div>
    );
}
