const express = require('express');
const router = express.Router();
const connection = require('../config'); // Asegúrate de tener la conexión configurada correctamente
const path = require('path');

// Ruta para mostrar la vista de reporte de perfiles profesionales
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'reporte_perfiles.html'));
});

// Ruta para obtener los perfiles profesionales en formato JSON (API)
router.get('/api/perfiles_profesionales', (req, res) => {
    const query = `
        SELECT 
            pp.id_perfil, 
            v.titulo_vacante, 
            p.nombreprofesion, 
            ne.nombre_educacion, 
            d.nombre_disponibilidad, 
            ps.valor_pretension, 
            el.explicacion_experiencia, 
            lc.nombre_licencia, 
            u.nombre_ubicacion, 
            re.rango_edad, 
            dv.nombre_disponibilidad  -- Corregido el campo aquí
        FROM perfiles_profesionales pp
        INNER JOIN vacantes_laborales v ON pp.id_vacante = v.id_vacante
        INNER JOIN profesiones p ON pp.id_profesion = p.ID
        INNER JOIN nivel_educacion ne ON pp.id_nivel_educacion = ne.id_educacon
        INNER JOIN disponibilidad d ON pp.id_disponibilidad = d.id_disponibilidad
        INNER JOIN pretension_salarial ps ON pp.id_pretension = ps.id_pretension
        INNER JOIN experiencia_laboral el ON pp.id_experiencia = el.id_experiencia
        INNER JOIN licencia_conducir lc ON pp.id_licencia = lc.id_licencia
        INNER JOIN ubicaciones u ON pp.id_ubicacion = u.id_ubicacion
        INNER JOIN rango_edad re ON pp.id_rango_edad = re.id_edad
        INNER JOIN disponibilidad_viajar dv ON pp.id_disponibilidad_viajar = dv.id_disponibilidad
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener perfiles profesionales:', err);
            return res.status(500).send('Error al obtener los perfiles profesionales.');
        }
        res.json(results);  // Devuelve los perfiles en formato JSON
    });
});

// Ruta para eliminar un perfil profesional
router.delete('/delete/:id_perfil', (req, res) => {
    const id_perfil = req.params.id_perfil;
    const deleteQuery = 'DELETE FROM perfiles_profesionales WHERE id_perfil = ?';

    connection.query(deleteQuery, [id_perfil], (err, result) => {
        if (err) {
            console.error('Error al eliminar perfil profesional:', err);
            return res.status(500).send('Error al eliminar el perfil profesional.');
        }
        res.send('Perfil profesional eliminado correctamente.');
    });
});

module.exports = router;
