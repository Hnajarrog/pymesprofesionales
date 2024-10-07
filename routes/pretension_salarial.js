const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Mostrar la vista de pretensiones salariales
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'pretension_salarial.html'));
});

// Obtener la lista de pretensiones salariales en formato JSON (para AJAX)
router.get('/api', (req, res) => {
    const query = 'SELECT * FROM pretension_salarial';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Agregar una nueva pretensión salarial
router.post('/add', (req, res) => {
    const { valor_pretension } = req.body;

    if (!valor_pretension) {
        return res.status(400).send('El valor de la pretensión salarial es obligatorio');
    }

    const query = 'INSERT INTO pretension_salarial (valor_pretension) VALUES (?)';
    connection.query(query, [valor_pretension], (err, result) => {
        if (err) {
            console.error('Error al agregar la pretensión salarial:', err);
            return res.status(500).send('Error al agregar la pretensión salarial');
        }
        res.redirect('/pretension_salarial');
    });
});

// Eliminar una pretensión salarial
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM pretension_salarial WHERE id_pretension = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la pretensión salarial:', err);
            return res.status(500).send('Error al eliminar la pretensión salarial');
        }
        res.redirect('/pretension_salarial');
    });
});

module.exports = router;
