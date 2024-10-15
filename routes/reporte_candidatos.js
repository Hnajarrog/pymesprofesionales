const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Ruta para mostrar la vista del reporte de candidatos
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'reporte_candidatos.html'));
});

// Ruta para obtener los datos de candidatos y mostrarlos en el reporte
router.get('/api/candidatos', (req, res) => {
    const query = `
        SELECT candidatos.*, 
               genero.nombre_genero, 
               profesiones.nombreprofesion, 
               nivel_educacion.nombre_educacion, 
               disponibilidad.nombre_disponibilidad, 
               pretension_salarial.valor_pretension, 
               experiencia_laboral.explicacion_experiencia, 
               licencia_conducir.nombre_licencia, 
               ubicaciones.nombre_ubicacion, 
               estado_civil.nombre_estado, 
               vacantes_laborales.titulo_vacante,
               disponibilidad_viajar.nombre_disponibilidad AS disponibilidad_viajar
        FROM candidatos
        LEFT JOIN genero ON candidatos.id_genero = genero.id_genero
        LEFT JOIN profesiones ON candidatos.id_profesion = profesiones.ID
        LEFT JOIN nivel_educacion ON candidatos.id_nivel_educacion = nivel_educacion.id_educacon
        LEFT JOIN disponibilidad ON candidatos.id_disponibilidad = disponibilidad.id_disponibilidad
        LEFT JOIN pretension_salarial ON candidatos.id_pretension = pretension_salarial.id_pretension
        LEFT JOIN experiencia_laboral ON candidatos.id_experiencia = experiencia_laboral.id_experiencia
        LEFT JOIN licencia_conducir ON candidatos.id_licencia = licencia_conducir.id_licencia
        LEFT JOIN ubicaciones ON candidatos.id_ubicacion = ubicaciones.id_ubicacion
        LEFT JOIN estado_civil ON candidatos.id_estado_civil = estado_civil.id_estado
        LEFT JOIN vacantes_laborales ON candidatos.id_vacante = vacantes_laborales.id_vacante
        LEFT JOIN disponibilidad_viajar ON candidatos.id_disponibilidad_viajar = disponibilidad_viajar.id_disponibilidad
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener candidatos:', err);
            return res.status(500).send('Error al obtener los datos de candidatos.');
        }
        res.json(results);
    });
});

module.exports = router;
