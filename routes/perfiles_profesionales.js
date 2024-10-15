const express = require('express');
const router = express.Router();
const connection = require('../config');
const path = require('path');

// Ruta para mostrar la vista de perfiles profesionales
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'perfiles_profesionales.html'));
});

// Ruta para obtener las vacantes laborales en formato JSON (API)
router.get('/api/vacantes', (req, res) => {
    const query = 'SELECT * FROM vacantes_laborales';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve las vacantes en formato JSON
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

// Ruta para obtener los rangos de edad en formato JSON (API)
router.get('/api/rango_edad', (req, res) => {
    const query = 'SELECT * FROM rango_edad';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve los rangos de edad en formato JSON
    });
});

// Ruta para obtener las disponibilidades para viajar en formato JSON (API)
router.get('/api/disponibilidad_viajar', (req, res) => {
    const query = 'SELECT * FROM disponibilidad_viajar';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve las disponibilidades para viajar en formato JSON
    });
});

// Ruta para agregar un nuevo perfil profesional
router.post('/add', (req, res) => {
    const { id_vacante, id_profesion, id_nivel_educacion, id_disponibilidad, id_pretension, id_experiencia, id_licencia, id_ubicacion, id_rango_edad, id_disponibilidad_viajar } = req.body;

    const insertQuery = `
        INSERT INTO perfiles_profesionales (id_vacante, id_profesion, id_nivel_educacion, id_disponibilidad, id_pretension, id_experiencia, id_licencia, id_ubicacion, id_rango_edad, id_disponibilidad_viajar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [id_vacante, id_profesion, id_nivel_educacion, id_disponibilidad, id_pretension, id_experiencia, id_licencia, id_ubicacion, id_rango_edad, id_disponibilidad_viajar];

    connection.query(insertQuery, values, (err, result) => {
        if (err) {
            console.error('Error al agregar el perfil profesional:', err);
            return res.status(500).send('Error al agregar el perfil profesional.');
        }
        res.send('<script>alert("Perfil profesional agregado exitosamente."); window.location.href="/perfiles_profesionales";</script>');
    });
});

module.exports = router;
