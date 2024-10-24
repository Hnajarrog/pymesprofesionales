const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Mostrar la vista de licencias de conducir
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'licencia_conducir.html'));
});

// Obtener la lista de licencias en formato JSON (para AJAX)
router.get('/api', (req, res) => {
    const query = 'SELECT * FROM licencia_conducir';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Agregar una nueva licencia de conducir
router.post('/add', (req, res) => {
    const { nombre_licencia } = req.body;

    if (!nombre_licencia) {
        return res.status(400).send('El tipo de licencia es obligatorio');
    }

    const query = 'INSERT INTO licencia_conducir (nombre_licencia) VALUES (?)';
    connection.query(query, [nombre_licencia], (err, result) => {
        if (err) {
            console.error('Error al agregar la licencia de conducir:', err);
            return res.status(500).send('Error al agregar la licencia de conducir');
        }
        res.redirect('/licencia_conducir');
    });
});

// Eliminar una licencia de conducir
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM licencia_conducir WHERE id_licencia = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la licencia de conducir:', err);
            return res.status(500).send('Error al eliminar la licencia de conducir');
        }
        res.redirect('/licencia_conducir');
    });
});
module.exports = router;
