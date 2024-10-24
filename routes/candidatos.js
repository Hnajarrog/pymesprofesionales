const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../config');

// Mostrar la vista de candidatos (hoja de vida)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'candidatos.html'));
});

// Ruta para obtener los géneros en formato JSON (API)
router.get('/api/genero', (req, res) => {
    const query = 'SELECT * FROM genero';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve los géneros en formato JSON
    });
});

// Ruta para obtener las profesiones en formato JSON (API)
router.get('/api/profesiones', (req, res) => {
    const query = 'SELECT * FROM profesiones';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve las profesiones en formato JSON
    });
});

// Ruta para obtener los niveles de educación en formato JSON (API)
router.get('/api/nivel_educacion', (req, res) => {
    const query = 'SELECT * FROM nivel_educacion';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve los niveles de educación en formato JSON
    });
});

// Ruta para obtener las disponibilidades horarias en formato JSON (API)
router.get('/api/disponibilidad', (req, res) => {
    const query = 'SELECT * FROM disponibilidad';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve las disponibilidades horarias en formato JSON
    });
});

// Ruta para obtener las pretensiones salariales en formato JSON (API)
router.get('/api/pretension_salarial', (req, res) => {
    const query = 'SELECT * FROM pretension_salarial';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve las pretensiones salariales en formato JSON
    });
});

// Ruta para obtener los rangos de edad en formato JSON (API)
router.get('/api/rango_edad', (req, res) => {
    const query = 'SELECT * FROM rango_edad';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve los rangos de edad en formato JSON
    });
});

// Ruta para obtener las experiencias laborales en formato JSON (API)
router.get('/api/experiencia_laboral', (req, res) => {
    const query = 'SELECT * FROM experiencia_laboral';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve las experiencias laborales en formato JSON
    });
});

// Ruta para obtener las licencias de conducir en formato JSON (API)
router.get('/api/licencia_conducir', (req, res) => {
    const query = 'SELECT * FROM licencia_conducir';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve las licencias de conducir en formato JSON
    });
});

// Ruta para obtener las ubicaciones en formato JSON (API)
router.get('/api/ubicaciones', (req, res) => {
    const query = 'SELECT * FROM ubicaciones';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve las ubicaciones en formato JSON
    });
});

// Ruta para obtener los estados civiles en formato JSON (API)
router.get('/api/estado_civil', (req, res) => {
    const query = 'SELECT * FROM estado_civil';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve los estados civiles en formato JSON
    });
});

// Ruta para obtener las vacantes laborales en formato JSON (API)
router.get('/api/vacantes_laborales', (req, res) => {
    const query = 'SELECT * FROM vacantes_laborales';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve las vacantes laborales en formato JSON
    });
});

// Ruta para obtener la disponibilidad de viajar en formato JSON (API)
router.get('/api/disponibilidad_viajar', (req, res) => {
    const query = 'SELECT * FROM disponibilidad_viajar';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve la disponibilidad para viajar en formato JSON
    });
});

// Ruta para agregar un nuevo candidato con verificación de duplicado
router.post('/add', (req, res) => {
    const {
        no_identificacion, nombres, apellidos, id_genero, id_profesion, id_nivel_educacion, 
        id_disponibilidad, id_pretension, fecha_nacimiento, id_experiencia, id_licencia, 
        id_ubicacion, id_estado_civil, id_vacante, id_disponibilidad_viajar, correo, telefono, 
        referencias_personales, referencias_laborales
    } = req.body;

    // Verificar si el número de identificación ya existe en la base de datos
    const checkQuery = 'SELECT * FROM candidatos WHERE no_identificacion = ?';
    connection.query(checkQuery, [no_identificacion], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // Si ya existe, redirigir con un mensaje de error
            res.send('<script>alert("Error: El número de identificación ya existe en la base de datos."); window.location.href="/candidatos";</script>');
        } else {
            // Si no existe, proceder con la inserción
            const insertQuery = `
                INSERT INTO candidatos (no_identificacion, nombres, apellidos, id_genero, id_profesion, 
                id_nivel_educacion, id_disponibilidad, id_pretension, fecha_nacimiento, id_experiencia, 
                id_licencia, id_ubicacion, id_estado_civil, id_vacante, id_disponibilidad_viajar, 
                correo, telefono, referencias_personales, referencias_laborales)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                no_identificacion, nombres, apellidos, id_genero, id_profesion, id_nivel_educacion, 
                id_disponibilidad, id_pretension, fecha_nacimiento, id_experiencia, id_licencia, 
                id_ubicacion, id_estado_civil, id_vacante, id_disponibilidad_viajar, correo, telefono, 
                referencias_personales, referencias_laborales
            ];

            connection.query(insertQuery, values, (err, result) => {
                if (err) {
                    console.error('Error al agregar candidato:', err);
                    return res.status(500).send('Error al agregar el candidato.');
                }
                // Redirige a la vista de candidatos con un mensaje de éxito
                res.send('<script>alert("Candidato agregado exitosamente."); window.location.href="/candidatos";</script>');
            });
        }
    });
});

module.exports = router;
