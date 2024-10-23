const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Ruta para mostrar la vista del reporte de estado del candidato
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'reporte_estado.html'));
});

// Ruta para obtener los datos de la tabla estado_candidatos
router.get('/api/estados_candidatos', (req, res) => {
    const query = `
        SELECT e.id_estado, CONCAT(c.nombres, ' ', c.apellidos) AS candidato, 
               v.titulo_vacante AS perfil, e.estado, e.comentario_rechazo, e.fecha_actualizacion
        FROM estados_candidatos e
        INNER JOIN comparaciones comp ON e.id_comparacion = comp.id_comparacion
        INNER JOIN candidatos c ON comp.id_candidato = c.id_candidato
        INNER JOIN perfiles_profesionales pp ON comp.id_perfil = pp.id_perfil
        INNER JOIN vacantes_laborales v ON pp.id_vacante = v.id_vacante
        ORDER BY e.fecha_actualizacion DESC
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los estados de los candidatos:', err);
            return res.status(500).send('Error al obtener los estados de los candidatos.');
        }
        res.json(results); // Devolver los resultados en formato JSON
    });
});

// Ruta para eliminar un estado de candidato
router.delete('/delete/:id_estado', (req, res) => {
    const { id_estado } = req.params;
    const query = 'DELETE FROM estados_candidatos WHERE id_estado = ?';

    connection.query(query, [id_estado], (err, result) => {
        if (err) {
            console.error('Error al eliminar el estado de candidato:', err);
            return res.status(500).send('Error al eliminar el estado de candidato.');
        }
        res.send('Estado de candidato eliminado exitosamente.');
    });
});

module.exports = router;
