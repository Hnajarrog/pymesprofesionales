const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Mostrar la vista de idiomas
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'gestion_idioma.html'));
});

// Obtener la lista de idiomas en formato JSON (para AJAX)
router.get('/api', (req, res) => {
    const query = 'SELECT * FROM idiomas';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Agregar un nuevo idioma
router.post('/add', (req, res) => {
    const { nombre_idioma } = req.body;

    if (!nombre_idioma) {
        return res.status(400).send('El nombre del idioma es obligatorio');
    }

    const query = 'INSERT INTO idiomas (nombre_idioma) VALUES (?)';
    connection.query(query, [nombre_idioma], (err, result) => {
        if (err) {
            console.error('Error al agregar el idioma:', err);
            return res.status(500).send('Error al agregar el idioma');
        }
        res.redirect('/gestion_idioma');
    });
});

// Eliminar un idioma
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM idiomas WHERE id_idioma = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el idioma:', err);
            return res.status(500).send('Error al eliminar el idioma');
        }
        res.redirect('/gestion_idioma');
    });
});
module.exports = router;
