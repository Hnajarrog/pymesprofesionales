const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Ruta para mostrar la vista de reporte_comparaciones
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'reporte_comparaciones.html'));
});

// Ruta para obtener los datos de comparaciones
router.get('/api/comparaciones', (req, res) => {
    const query = `
        SELECT comp.id_comparacion,
               CONCAT(ca.nombres, ' ', ca.apellidos) AS candidato_nombre,
               v.titulo_vacante AS perfil_nombre,
               comp.afinidad,
               comp.discrepancias,
               comp.fecha_comparacion
        FROM comparaciones comp
        INNER JOIN candidatos ca ON comp.id_candidato = ca.id_candidato
        INNER JOIN perfiles_profesionales pp ON comp.id_perfil = pp.id_perfil
        INNER JOIN vacantes_laborales v ON pp.id_vacante = v.id_vacante
        ORDER BY comp.fecha_comparacion DESC
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener comparaciones:', err);
            return res.status(500).send('Error al obtener los datos de comparaciones.');
        }
        res.json(results); // Devolver los resultados en formato JSON
    });
});

// Ruta para eliminar una comparación
router.delete('/delete/:id_comparacion', (req, res) => {
    const { id_comparacion } = req.params;
    const query = 'DELETE FROM comparaciones WHERE id_comparacion = ?';

    connection.query(query, [id_comparacion], (err, result) => {
        if (err) {
            console.error('Error al eliminar comparación:', err);
            return res.status(500).send('Error al eliminar la comparación.');
        }
        res.send('Comparación eliminada exitosamente.');
    });
});

module.exports = router;
