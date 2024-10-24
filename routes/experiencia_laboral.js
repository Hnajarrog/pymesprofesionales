const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Mostrar la vista de experiencia laboral
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'experiencia_laboral.html'));
});

// Obtener la lista de experiencias laborales en formato JSON (para AJAX)
router.get('/api', (req, res) => {
    const query = 'SELECT * FROM experiencia_laboral ORDER BY explicacion_experiencia ASC'; // Ordenar alfabéticamente
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Agregar una nueva experiencia laboral
router.post('/add', (req, res) => {
    const { explicacion_experiencia } = req.body;

    if (!explicacion_experiencia) {
        return res.status(400).send('La experiencia laboral es obligatoria');
    }

    const query = 'INSERT INTO experiencia_laboral (explicacion_experiencia) VALUES (?)';
    connection.query(query, [explicacion_experiencia], (err, result) => {
        if (err) {
            console.error('Error al agregar la experiencia laboral:', err);
            return res.status(500).send('Error al agregar la experiencia laboral');
        }
        res.redirect('/experiencia_laboral');
    });
});

// Eliminar una experiencia laboral
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM experiencia_laboral WHERE id_experiencia = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la experiencia laboral:', err);
            return res.status(500).send('Error al eliminar la experiencia laboral');
        }
        res.redirect('/experiencia_laboral');
    });
});

module.exports = router;
