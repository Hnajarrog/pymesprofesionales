const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Mostrar la vista de disponibilidad horaria
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'disponibilidad.html'));
});

// Obtener la lista de disponibilidades horarias en formato JSON (para AJAX)
router.get('/api', (req, res) => {
    const query = 'SELECT * FROM disponibilidad';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Agregar una nueva disponibilidad horaria
router.post('/add', (req, res) => {
    const { nombre_disponibilidad } = req.body;

    if (!nombre_disponibilidad) {
        return res.status(400).send('El nombre de la disponibilidad horaria es obligatorio');
    }

    const query = 'INSERT INTO disponibilidad (nombre_disponibilidad) VALUES (?)';
    connection.query(query, [nombre_disponibilidad], (err, result) => {
        if (err) {
            console.error('Error al agregar la disponibilidad horaria:', err);
            return res.status(500).send('Error al agregar la disponibilidad horaria');
        }
        res.redirect('/disponibilidad');
    });
});

// Eliminar una disponibilidad horaria
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM disponibilidad WHERE id_disponibilidad = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la disponibilidad horaria:', err);
            return res.status(500).send('Error al eliminar la disponibilidad horaria');
        }
        res.redirect('/disponibilidad');
    });
});

module.exports = router;
