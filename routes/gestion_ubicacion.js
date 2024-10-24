const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Mostrar la vista de ubicaciones
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'gestion_ubicacion.html'));
});

// Obtener la lista de ubicaciones en formato JSON (para AJAX)
router.get('/api', (req, res) => {
    const query = 'SELECT * FROM ubicaciones ORDER BY nombre_ubicacion ASC';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});



// Agregar una nueva ubicación
router.post('/add', (req, res) => {
    const { nombre_ubicacion } = req.body;

    if (!nombre_ubicacion) {
        return res.status(400).send('El nombre de la ubicación es obligatorio');
    }

    const query = 'INSERT INTO ubicaciones (nombre_ubicacion) VALUES (?)';
    connection.query(query, [nombre_ubicacion], (err, result) => {
        if (err) {
            console.error('Error al agregar la ubicación:', err);
            return res.status(500).send('Error al agregar la ubicación');
        }
        res.redirect('/gestion_ubicacion');
    });
});

// Eliminar una ubicación
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM ubicaciones WHERE id_ubicacion = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la ubicación:', err);
            return res.status(500).send('Error al eliminar la ubicación');
        }
        res.redirect('/gestion_ubicacion');
    });
});

module.exports = router;
