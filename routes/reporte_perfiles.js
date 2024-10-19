const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Ruta para mostrar la vista del reporte de perfiles
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'reporte_perfiles.html'));
});

// Ruta para obtener los datos de perfiles y mostrarlos en el reporte
router.get('/api/perfiles', (req, res) => {
    const query = `
        SELECT perfiles_profesionales.*, 
               vacantes_laborales.titulo_vacante, 
               profesiones.nombreprofesion, 
               nivel_educacion.nombre_educacion, 
               disponibilidad.nombre_disponibilidad, 
               pretension_salarial.valor_pretension, 
               experiencia_laboral.explicacion_experiencia, 
               licencia_conducir.nombre_licencia, 
               ubicaciones.nombre_ubicacion, 
               rango_edad.rango_edad, 
               disponibilidad_viajar.nombre_disponibilidad AS disponibilidad_viajar
        FROM perfiles_profesionales
        LEFT JOIN vacantes_laborales ON perfiles_profesionales.id_vacante = vacantes_laborales.id_vacante
        LEFT JOIN profesiones ON perfiles_profesionales.id_profesion = profesiones.ID
        LEFT JOIN nivel_educacion ON perfiles_profesionales.id_nivel_educacion = nivel_educacion.id_educacon
        LEFT JOIN disponibilidad ON perfiles_profesionales.id_disponibilidad = disponibilidad.id_disponibilidad
        LEFT JOIN pretension_salarial ON perfiles_profesionales.id_pretension = pretension_salarial.id_pretension
        LEFT JOIN experiencia_laboral ON perfiles_profesionales.id_experiencia = experiencia_laboral.id_experiencia
        LEFT JOIN licencia_conducir ON perfiles_profesionales.id_licencia = licencia_conducir.id_licencia
        LEFT JOIN ubicaciones ON perfiles_profesionales.id_ubicacion = ubicaciones.id_ubicacion
        LEFT JOIN rango_edad ON perfiles_profesionales.id_rango_edad = rango_edad.id_edad
        LEFT JOIN disponibilidad_viajar ON perfiles_profesionales.id_disponibilidad_viajar = disponibilidad_viajar.id_disponibilidad
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener perfiles profesionales:', err);
            return res.status(500).send('Error al obtener los datos de perfiles.');
        }
        res.json(results);
    });
});

// Ruta para eliminar un perfil profesional
router.delete('/delete/:id_perfil', (req, res) => {
    const { id_perfil } = req.params;
    const deleteQuery = 'DELETE FROM perfiles_profesionales WHERE id_perfil = ?';

    connection.query(deleteQuery, [id_perfil], (err, results) => {
        if (err) {
            console.error('Error al eliminar el perfil profesional:', err);
            return res.status(500).send('Error al eliminar el perfil profesional.');
        }
        res.send('Perfil profesional eliminado con éxito.');
    });
});

module.exports = router;
