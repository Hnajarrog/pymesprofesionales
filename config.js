// config.js
const mysql = require('mysql');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',    // Cambia esto si tu base de datos está en otro servidor
    user: 'root',         // Usuario de la base de datos
    password: 'MyStr0ng@Password!', // Contraseña de la base de datos
    database: 'pymesprofesionales'  // Nombre de la base de datos
  
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

module.exports = connection;
