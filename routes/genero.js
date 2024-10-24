const express = require('express');
const router = express.Router();
const connection = require('../config');  // Conexión a la base de datos desde config.js
const path = require('path');

// Ruta para mostrar la vista de géneros
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'genero.html'));
});

// Ruta para obtener los géneros en formato JSON (AJAX)
router.get('/api', (req, res) => {
    const query = 'SELECT * FROM genero';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los géneros:', err);
            return res.status(500).send('Error al obtener los géneros');
        }
        res.json(results);
    });
});

// Ruta para agregar un nuevo género
router.post('/add', (req, res) => {
    const { nombre_genero } = req.body;

    if (!nombre_genero) {
        return res.status(400).send('El nombre del género es obligatorio');
    }

    const query = 'INSERT INTO genero (nombre_genero) VALUES (?)';
    connection.query(query, [nombre_genero], (err, result) => {
        if (err) {
            console.error('Error al agregar el género:', err);
            return res.status(500).send('Error al agregar el género');
        }
        res.redirect('/genero');
    });
});

// Ruta para eliminar un género
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM genero WHERE id_genero = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el género:', err);
            return res.status(500).send('Error al eliminar el género');
        }
        res.redirect('/genero');
    });
});

module.exports = router;
