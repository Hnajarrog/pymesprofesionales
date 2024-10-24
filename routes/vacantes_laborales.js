const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Mostrar la vista de vacantes laborales
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'vacantes_laborales.html'));
});

// Obtener la lista de vacantes laborales en formato JSON (para AJAX)
router.get('/api', (req, res) => {
    const query = 'SELECT * FROM vacantes_laborales';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Agregar una nueva vacante laboral
router.post('/add', (req, res) => {
    const { titulo_vacante, descripcion_vacante } = req.body;

    if (!titulo_vacante || !descripcion_vacante) {
        return res.status(400).send('El título y la descripción de la vacante son obligatorios');
    }

    const query = 'INSERT INTO vacantes_laborales (titulo_vacante, descripcion_vacante) VALUES (?, ?)';
    connection.query(query, [titulo_vacante, descripcion_vacante], (err, result) => {
        if (err) {
            console.error('Error al agregar la vacante laboral:', err);
            return res.status(500).send('Error al agregar la vacante laboral');
        }
        res.redirect('/vacantes_laborales');
    });
});

// Cambiar el estado de la vacante laboral
router.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const { estado_vacante } = req.body;
    
    const query = 'UPDATE vacantes_laborales SET estado_vacante = ? WHERE id_vacante = ?';
    connection.query(query, [estado_vacante, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el estado de la vacante:', err);
            return res.status(500).send('Error al actualizar el estado de la vacante');
        }
        res.redirect('/vacantes_laborales');
    });
});

// Eliminar una vacante laboral
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM vacantes_laborales WHERE id_vacante = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la vacante laboral:', err);
            return res.status(500).send('Error al eliminar la vacante laboral');
        }
        res.redirect('/vacantes_laborales');
    });
});

module.exports = router;
