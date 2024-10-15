const express = require('express');
const router = express.Router();
const connection = require('../config'); // Asegúrate de que la conexión a la base de datos esté configurada
const path = require('path');

// Ruta para mostrar la lista de disponibilidades de viaje
router.get('/', (req, res) => {
    const query = 'SELECT * FROM disponibilidad_viajar';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.sendFile(path.join(__dirname, '../public', 'disponibilidad_viajar.html'));  // Renderiza la vista
    });
});

// Ruta para obtener los datos en formato JSON
router.get('/api', (req, res) => {
    const query = 'SELECT * FROM disponibilidad_viajar';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Retorna los datos en formato JSON para AJAX
    });
});

// Ruta para agregar una nueva opción de disponibilidad de viaje
router.post('/add', (req, res) => {
    const { nombre_disponibilidad } = req.body;
    const query = 'INSERT INTO disponibilidad_viajar (nombre_disponibilidad) VALUES (?)';
    connection.query(query, [nombre_disponibilidad], (err, result) => {
        if (err) throw err;
        res.redirect('/disponibilidad_viajar');  // Redirige a la lista de disponibilidades después de agregar
    });
});

// Ruta para eliminar una disponibilidad de viaje
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM disponibilidad_viajar WHERE id_disponibilidad = ?';
    connection.query(query, [id], (err, result) => {
        if (err) throw err;
        res.redirect('/disponibilidad_viajar');  // Redirige a la lista después de eliminar
    });
});

module.exports = router;
