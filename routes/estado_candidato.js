const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Ruta para mostrar la vista de gestión de estado del candidato
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'estado_candidato.html'));
});

// Ruta para obtener datos de candidatos y comparaciones
router.get('/api/obtenerCandidatos', (req, res) => {
    const query = `
        SELECT c.id_comparacion, CONCAT(ca.nombres, ' ', ca.apellidos) AS candidato, 
               v.titulo_vacante AS perfil, IFNULL(c.discrepancias, 'Sin discrepancias') AS discrepancias, 
               IFNULL(e.estado, 'Pendiente') AS estado, e.comentario_rechazo, e.fecha_actualizacion
        FROM comparaciones c
        INNER JOIN candidatos ca ON c.id_candidato = ca.id_candidato
        INNER JOIN perfiles_profesionales pp ON c.id_perfil = pp.id_perfil
        INNER JOIN vacantes_laborales v ON pp.id_vacante = v.id_vacante
        LEFT JOIN estados_candidatos e ON c.id_comparacion = e.id_comparacion
        ORDER BY ca.nombres ASC
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener comparaciones:', err);
            return res.status(500).send('Error al obtener los datos de comparaciones.');
        }
        res.json(results);  // Devolver los resultados en formato JSON
    });
});

// Ruta para guardar o actualizar el estado del candidato
router.post('/api/guardarEstado', (req, res) => {
    const { id_comparacion, estado, comentario_rechazo } = req.body;

    // Verificar si ya existe un estado para esta comparación
    const queryCheck = 'SELECT * FROM estados_candidatos WHERE id_comparacion = ?';
    connection.query(queryCheck, [id_comparacion], (err, result) => {
        if (err) {
            console.error('Error al verificar el estado:', err);
            return res.status(500).send('Error al verificar el estado.');
        }

        if (result.length > 0) {
            // Si existe, actualizar el estado
            const queryUpdate = `
                UPDATE estados_candidatos
                SET estado = ?, comentario_rechazo = ?, fecha_actualizacion = NOW()
                WHERE id_comparacion = ?
            `;
            connection.query(queryUpdate, [estado, comentario_rechazo, id_comparacion], (err, result) => {
                if (err) {
                    console.error('Error al actualizar estado:', err);
                    return res.status(500).send('Error al actualizar el estado.');
                }
                res.send('Estado actualizado correctamente.');
            });
        } else {
            // Si no existe, insertar un nuevo estado
            const queryInsert = `
                INSERT INTO estados_candidatos (id_comparacion, estado, comentario_rechazo, fecha_actualizacion)
                VALUES (?, ?, ?, NOW())
            `;
            connection.query(queryInsert, [id_comparacion, estado, comentario_rechazo], (err, result) => {
                if (err) {
                    console.error('Error al guardar estado:', err);
                    return res.status(500).send('Error al guardar el estado.');
                }
                res.send('Estado guardado correctamente.');
            });
        }
    });
});

// Ruta para eliminar el estado de un candidato
router.delete('/api/eliminarEstado/:id_comparacion', (req, res) => {
    const { id_comparacion } = req.params;

    const queryDelete = 'DELETE FROM estados_candidatos WHERE id_comparacion = ?';
    connection.query(queryDelete, [id_comparacion], (err, result) => {
        if (err) {
            console.error('Error al eliminar estado:', err);
            return res.status(500).send('Error al eliminar el estado.');
        }
        res.send('Estado eliminado correctamente.');
    });
});

module.exports = router;

