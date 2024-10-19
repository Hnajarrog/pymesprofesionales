const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Ruta para mostrar la vista de comparación
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'comparacion_perfiles.html'));
});

// Ruta para obtener candidatos y perfiles para los select
router.get('/api/obtenerCandidatosPerfiles', (req, res) => {
    const queryCandidatos = 'SELECT id_candidato, CONCAT(nombres, " ", apellidos) AS nombre_completo FROM candidatos';
    const queryPerfiles = `
        SELECT pp.id_perfil, v.titulo_vacante AS nombreprofesion 
        FROM perfiles_profesionales pp
        INNER JOIN vacantes_laborales v ON pp.id_vacante = v.id_vacante`;

    // Ejecutar la consulta de candidatos primero
    connection.query(queryCandidatos, (err, candidatos) => {
        if (err) {
            console.error('Error al obtener candidatos:', err);
            return res.status(500).send('Error al obtener los datos de candidatos.');
        }

        // Luego ejecutar la consulta de perfiles
        connection.query(queryPerfiles, (err, perfiles) => {
            if (err) {
                console.error('Error al obtener perfiles:', err);
                return res.status(500).send('Error al obtener los datos de perfiles.');
            }

            // Enviar ambos resultados como respuesta
            res.json({
                candidatos: candidatos,
                perfiles: perfiles
            });
        });
    });
});

// Ruta para realizar la comparación
router.get('/api/comparar/:id_candidato/:id_perfil', (req, res) => {
    const { id_candidato, id_perfil } = req.params;

    const queryCandidato = `
        SELECT c.*, p.nombreprofesion, ne.nombre_educacion, d.nombre_disponibilidad, ps.valor_pretension, el.explicacion_experiencia, lc.nombre_licencia, u.nombre_ubicacion
        FROM candidatos c
        INNER JOIN profesiones p ON c.id_profesion = p.ID
        INNER JOIN nivel_educacion ne ON c.id_nivel_educacion = ne.id_educacon
        INNER JOIN disponibilidad d ON c.id_disponibilidad = d.id_disponibilidad
        INNER JOIN pretension_salarial ps ON c.id_pretension = ps.id_pretension
        INNER JOIN experiencia_laboral el ON c.id_experiencia = el.id_experiencia
        INNER JOIN licencia_conducir lc ON c.id_licencia = lc.id_licencia
        INNER JOIN ubicaciones u ON c.id_ubicacion = u.id_ubicacion
        WHERE c.id_candidato = ?`;

    const queryPerfil = `
        SELECT pp.*, v.titulo_vacante, p.nombreprofesion, ne.nombre_educacion, d.nombre_disponibilidad, ps.valor_pretension, el.explicacion_experiencia, lc.nombre_licencia, u.nombre_ubicacion
        FROM perfiles_profesionales pp
        INNER JOIN vacantes_laborales v ON pp.id_vacante = v.id_vacante
        INNER JOIN profesiones p ON pp.id_profesion = p.ID
        INNER JOIN nivel_educacion ne ON pp.id_nivel_educacion = ne.id_educacon
        INNER JOIN disponibilidad d ON pp.id_disponibilidad = d.id_disponibilidad
        INNER JOIN pretension_salarial ps ON pp.id_pretension = ps.id_pretension
        INNER JOIN experiencia_laboral el ON pp.id_experiencia = el.id_experiencia
        INNER JOIN licencia_conducir lc ON pp.id_licencia = lc.id_licencia
        INNER JOIN ubicaciones u ON pp.id_ubicacion = u.id_ubicacion
        WHERE pp.id_perfil = ?`;

    // Obtener los datos del candidato
    connection.query(queryCandidato, [id_candidato], (err, candidatoResults) => {
        if (err) {
            console.error('Error al obtener datos del candidato:', err);
            return res.status(500).send('Error al obtener los datos del candidato.');
        }

        const candidato = candidatoResults[0];  // Primer resultado: datos del candidato

        // Obtener los datos del perfil profesional
        connection.query(queryPerfil, [id_perfil], (err, perfilResults) => {
            if (err) {
                console.error('Error al obtener datos del perfil:', err);
                return res.status(500).send('Error al obtener los datos del perfil.');
            }

            const perfil = perfilResults[0];  // Segundo resultado: datos del perfil profesional

            // Calcular afinidad
            const { afinidad, diferencias } = calcularAfinidad(candidato, perfil);

            // Retornar el resultado con el porcentaje de afinidad y las diferencias
            res.json({
                afinidad: afinidad.toFixed(2) + '%',
                diferencias,
                candidatoNombre: `${candidato.nombres} ${candidato.apellidos}`,
                perfilNombre: perfil.titulo_vacante
            });
        });
    });
});

// Función para calcular afinidad y diferencias
function calcularAfinidad(candidato, perfil) {
    let totalCriterios = 7;  // Total de criterios a comparar
    let coincidencias = 0;
    let diferencias = [];

    if (candidato.id_profesion === perfil.id_profesion) coincidencias++;
    else diferencias.push('Profesión');
    
    if (candidato.id_nivel_educacion === perfil.id_nivel_educacion) coincidencias++;
    else diferencias.push('Nivel de Educación');
    
    if (candidato.id_experiencia === perfil.id_experiencia) coincidencias++;
    else diferencias.push('Experiencia Laboral');
    
    if (candidato.id_disponibilidad === perfil.id_disponibilidad) coincidencias++;
    else diferencias.push('Disponibilidad');
    
    if (candidato.id_pretension === perfil.id_pretension) coincidencias++;
    else diferencias.push('Pretensión Salarial');
    
    if (candidato.id_licencia === perfil.id_licencia) coincidencias++;
    else diferencias.push('Licencia de Conducir');
    
    if (candidato.id_disponibilidad_viajar === perfil.id_disponibilidad_viajar) coincidencias++;
    else diferencias.push('Disponibilidad para Viajar');

    const afinidad = (coincidencias / totalCriterios) * 100;
    return { afinidad, diferencias };
}

// Ruta para guardar la comparación
router.post('/api/guardarComparacion', (req, res) => {
    const { id_candidato, id_perfil, afinidad } = req.body;

    const queryInsert = `
        INSERT INTO comparaciones (id_candidato, id_perfil, afinidad) 
        VALUES (?, ?, ?)`;

    connection.query(queryInsert, [id_candidato, id_perfil, afinidad], (err, result) => {
        if (err) {
            console.error('Error al guardar la comparación:', err);
            return res.status(500).send('Error al guardar la comparación.');
        }
        res.send('Comparación guardada correctamente.');
    });
});

module.exports = router;
