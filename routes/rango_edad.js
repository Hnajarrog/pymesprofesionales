const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Mostrar la vista de rango de edad
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'rango_edad.html'));
});

// Obtener la lista de rangos de edad en formato JSON (para AJAX)
router.get('/api', (req, res) => {
    const query = 'SELECT * FROM rango_edad';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Agregar un nuevo rango de edad
router.post('/add', (req, res) => {
    const { rango_edad } = req.body;

    if (!rango_edad) {
        return res.status(400).send('El rango de edad es obligatorio');
    }

    const query = 'INSERT INTO rango_edad (rango_edad) VALUES (?)';
    connection.query(query, [rango_edad], (err, result) => {
        if (err) {
            console.error('Error al agregar el rango de edad:', err);
            return res.status(500).send('Error al agregar el rango de edad');
        }
        res.redirect('/rango_edad');
    });
});

// Eliminar un rango de edad
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM rango_edad WHERE id_edad = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el rango de edad:', err);
            return res.status(500).send('Error al eliminar el rango de edad');
        }
        res.redirect('/rango_edad');
    });
});

module.exports = router;
