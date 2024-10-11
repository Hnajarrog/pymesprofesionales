const express = require('express');
const router = express.Router();
const connection = require('../config'); // Asumiendo que tienes un archivo config.js con la configuración de la base de datos

// Ruta principal para mostrar el formulario de login
router.get('/', (req, res) => {
    const error = req.query.error || null;  // Captura el error desde la URL
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Iniciar Sesión</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f8efef;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .login-container {
                    background-color: rgb(221, 214, 214);
                    padding: 25px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    width: 300px;
                }
                h1 {
                    text-align: center;
                    color: #333;
                }
                input[type="email"],
                input[type="password"] {
                    width: 100%;
                    padding: 9px;
                    margin: 9px 0;
                    border: 2px solid #ccc;
                    border-radius: 4px;
                }
                button {
                    width: 100%;
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #0056b3;
                }
                .toggle-password {
                    margin-top: -25px;
                    margin-bottom: 10px;
                    float: right;
                    cursor: pointer;
                }
                .error-message {
                    color: red;
                    text-align: center;
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="login-container">
                <h1>Iniciar Sesión</h1>
                ${error ? `<div class="error-message">${error}</div>` : ''}
                <form action="/login" method="POST">
                    <input type="email" name="correo" placeholder="Correo Electrónico" required><br>
                    <input type="password" id="password" name="password" placeholder="Contraseña" required>
                    <span class="toggle-password" onclick="togglePassword()">Mostrar</span><br>
                    <button type="submit">Iniciar Sesión</button>
                </form>
            </div>

            <script>
                function togglePassword() {
                    const passwordField = document.getElementById("password");
                    const toggleText = document.querySelector(".toggle-password");
                    if (passwordField.type === "password") {
                        passwordField.type = "text";
                        toggleText.textContent = "Ocultar";
                    } else {
                        passwordField.type = "password";
                        toggleText.textContent = "Mostrar";
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// Ruta para manejar el login
router.post('/login', (req, res) => {
    const { correo, password } = req.body;
    const query = 'SELECT * FROM Usuarios WHERE Correo = ?';

    connection.query(query, [correo], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            // Si no se encuentra el usuario, redirigir al login con mensaje de error
            return res.redirect('/?error=Correo o contraseña incorrectos');
        }

        const user = results[0];
        if (password === user.Contraseña) {
            // Si la contraseña es correcta, iniciar sesión y redirigir al menú
            req.session.userId = user.IDUsuario;
            return res.redirect('/menu');
        } else {
            // Si la contraseña es incorrecta, redirigir al login con mensaje de error
            return res.redirect('/?error=Correo o contraseña incorrectos');
        }
    });
});

module.exports = router;
