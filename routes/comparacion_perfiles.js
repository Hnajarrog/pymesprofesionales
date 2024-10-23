const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Ruta para mostrar la vista de comparación de perfiles
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

    connection.query(queryCandidatos, (err, candidatos) => {
        if (err) {
            console.error('Error al obtener candidatos:', err);
            return res.status(500).send('Error al obtener los datos de candidatos.');
        }

        connection.query(queryPerfiles, (err, perfiles) => {
            if (err) {
                console.error('Error al obtener perfiles:', err);
                return res.status(500).send('Error al obtener los datos de perfiles.');
            }

            res.json({
                candidatos: candidatos,
                perfiles: perfiles
            });
        });
    });
});

// Ruta para realizar la comparación de afinidad
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
        WHERE id_candidato = ?`;

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
        WHERE id_perfil = ?`;

    connection.query(queryCandidato, [id_candidato], (err, candidatoResults) => {
        if (err) {
            console.error('Error al obtener datos del candidato:', err);
            return res.status(500).send('Error al obtener los datos del candidato.');
        }

        const candidato = candidatoResults[0];  

        connection.query(queryPerfil, [id_perfil], (err, perfilResults) => {
            if (err) {
                console.error('Error al obtener datos del perfil:', err);
                return res.status(500).send('Error al obtener los datos del perfil.');
            }

            const perfil = perfilResults[0];  

            const { afinidad, discrepancias } = calcularAfinidad(candidato, perfil);

            res.json({
                afinidad: afinidad.toFixed(2) + '%',
                candidatoNombre: `${candidato.nombres} ${candidato.apellidos}`,
                perfilNombre: perfil.titulo_vacante,
                discrepancias: discrepancias.join('; ')
            });
        });
    });
});

// Función para calcular afinidad
function calcularAfinidad(candidato, perfil) {
    let totalCriterios = 7;  
    let coincidencias = 0;
    let discrepancias = [];

    if (candidato.id_profesion === perfil.id_profesion) {
        coincidencias++;
    } else {
        discrepancias.push(`Profesión: ${candidato.nombreprofesion} no coincide con ${perfil.nombreprofesion}`);
    }

    if (candidato.id_nivel_educacion === perfil.id_nivel_educacion) {
        coincidencias++;
    } else {
        discrepancias.push(`Nivel de Educación: ${candidato.nombre_educacion} no coincide con ${perfil.nombre_educacion}`);
    }

    if (candidato.id_experiencia === perfil.id_experiencia) {
        coincidencias++;
    } else {
        discrepancias.push(`Experiencia: ${candidato.explicacion_experiencia} no coincide con ${perfil.explicacion_experiencia}`);
    }

    if (candidato.id_disponibilidad === perfil.id_disponibilidad) {
        coincidencias++;
    } else {
        discrepancias.push(`Disponibilidad: ${candidato.nombre_disponibilidad} no coincide con ${perfil.nombre_disponibilidad}`);
    }

    if (candidato.id_pretension === perfil.id_pretension) {
        coincidencias++;
    } else {
        discrepancias.push(`Pretensión Salarial: ${candidato.valor_pretension} no coincide con ${perfil.valor_pretension}`);
    }

    if (candidato.id_licencia === perfil.id_licencia) {
        coincidencias++;
    } else {
        discrepancias.push(`Licencia de Conducir: ${candidato.nombre_licencia} no coincide con ${perfil.nombre_licencia}`);
    }

    if (candidato.id_disponibilidad_viajar === perfil.id_disponibilidad_viajar) {
        coincidencias++;
    } else {
        discrepancias.push(`Disponibilidad para Viajar: ${candidato.id_disponibilidad_viajar} no coincide con ${perfil.id_disponibilidad_viajar}`);
    }

    let afinidad = (coincidencias / totalCriterios) * 100;

    return { afinidad, discrepancias };
}

// Ruta para guardar una comparación
router.post('/api/guardar', (req, res) => {
    const { id_candidato, id_perfil, afinidad, discrepancias } = req.body;

    const query = `
        INSERT INTO comparaciones (id_candidato, id_perfil, afinidad, discrepancias)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(query, [id_candidato, id_perfil, afinidad, discrepancias], (err, results) => {
        if (err) {
            console.error('Error al guardar la comparación:', err);
            return res.status(500).send('Error al guardar la comparación.');
        }
        res.send('Comparación guardada correctamente');
    });
});
module.exports = router;
