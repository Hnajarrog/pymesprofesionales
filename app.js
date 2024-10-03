const express = require('express');
const session = require('express-session'); // Uso de node.js express para la sesión 
const mysql = require('mysql'); // Driver para la base de datos 
const path = require('path'); 
const connection = require('./config');  // Conexión a la base de datos

const app = express();
const port = process.env.PORT || 3000;

// Configurar archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para manejar sesiones
app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 15 * 60 * 1000 } // 15 minutos de sesión
}));

// Middleware para manejar datos de formularios
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Ruta principal para el login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ruta para manejar el login
app.post('/login', (req, res) => {
    const { correo, password } = req.body;
    const query = 'SELECT * FROM Usuarios WHERE Correo = ?';

    connection.query(query, [correo], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.sendFile(path.join(__dirname, 'public', 'login.html')); // Mostrar el login si no se encuentra usuario
        }

        const user = results[0];
        if (password === user.Contraseña) {
            req.session.userId = user.IDUsuario;
            res.redirect('/menu');
        } else {
            res.sendFile(path.join(__dirname, 'public', 'login.html')); // Contraseña incorrecta
        }
    });
});

// Ruta para mostrar el menú principal
app.get('/menu', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'public', 'menu.html')); // Mostrar el archivo HTML del menú
});

// Ruta para mostrar la página de gestión de profesiones
app.get('/profesiones', (req, res) => {
    const query = 'SELECT * FROM profesiones';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.sendFile(path.join(__dirname, 'public', 'profesiones.html'));  // Mostrar la página profesiones.html
    });
});

// Ruta para agregar una nueva profesión
app.post('/profesiones/add', (req, res) => {
    const { nombreprofesion } = req.body;

    if (!nombreprofesion) {
        return res.status(400).send('El campo nombre de la profesión es obligatorio');
    }

    const query = 'INSERT INTO profesiones (nombreprofesion) VALUES (?)';
    connection.query(query, [nombreprofesion], (err, result) => {
        if (err) {
            console.error('Error al insertar la profesión:', err);
            return res.status(500).send('Error al agregar la profesión');
        }
        res.redirect('/profesiones');
    });
});

// Ruta para obtener la lista de profesiones
app.get('/api/profesiones', (req, res) => {
    const query = 'SELECT * FROM profesiones';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Enviar los resultados en formato JSON
    });
});

// Ruta para eliminar una profesión
app.post('/profesiones/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM profesiones WHERE ID = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la profesión:', err);
            return res.status(500).send('Error al eliminar la profesión');
        }
        res.redirect('/profesiones');
    });
});


// Ruta para mostrar la vista de gestión de nivel de educación
app.get('/nivel_educacion', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'nivel_educacion.html'));  // Cargar la página de nivel de educación
});

// Ruta para obtener los niveles de educación en formato JSON
app.get('/api/nivel_educacion', (req, res) => {
    const query = 'SELECT * FROM nivel_educacion';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Enviar los resultados en formato JSON
    });
});

// Ruta para agregar un nuevo nivel de educación
app.post('/nivel_educacion/add', (req, res) => {
    const { nombre_educacion } = req.body;

    // Verificar si el nivel de educación ya existe
    const checkQuery = 'SELECT * FROM nivel_educacion WHERE nombre_educacion = ?';
    connection.query(checkQuery, [nombre_educacion], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // Si el nivel de educación ya existe, mostrar un mensaje de error
            res.send(`<script>alert('El nivel de educación ya existe.'); window.location.href='/nivel_educacion';</script>`);
        } else {
            // Insertar el nuevo nivel de educación
            const insertQuery = 'INSERT INTO nivel_educacion (nombre_educacion) VALUES (?)';
            connection.query(insertQuery, [nombre_educacion], (err, result) => {
                if (err) throw err;
                res.redirect('/nivel_educacion');
            });
        }
    });
});

// Ruta para eliminar un nivel de educación
app.post('/nivel_educacion/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM nivel_educacion WHERE id_educacion = ?';
    connection.query(query, [id], (err, result) => {
        if (err) throw err;
        res.redirect('/nivel_educacion');
    });
});

// Ruta para mostrar la vista de creación de usuarios con listas desplegables para roles y áreas
app.get('/usuarios/create', (req, res) => {
    const queryRoles = 'SELECT * FROM roles_pyme';
    const queryAreas = 'SELECT * FROM areapymes';

    connection.query(queryRoles, (errRoles, rolesResults) => {
        if (errRoles) throw errRoles;

        connection.query(queryAreas, (errAreas, areasResults) => {
            if (errAreas) throw errAreas;

            res.sendFile(path.join(__dirname, 'public', 'usuarios.html'));  // Muestra la vista usuarios.html
        });
    });
});

// Ruta para mostrar la lista de usuarios
app.get('/usuarios', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'usuarios.html'));  // Muestra la vista usuarios.html
});

// Ruta para obtener todos los usuarios en formato JSON
app.get('/api/usuarios', (req, res) => {
    const query = `
        SELECT Usuarios.*, roles_pyme.nombre_rol, areapymes.nombrearea 
        FROM Usuarios
        LEFT JOIN roles_pyme ON Usuarios.IDRol = roles_pyme.id_rol
        LEFT JOIN areapymes ON Usuarios.IDArea = areapymes.id_area;
    `;
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Devuelve los resultados en formato JSON
    });
});

// Ruta para obtener todos los roles y áreas en formato JSON
app.get('/api/rolesareas', (req, res) => {
    const queryRoles = 'SELECT * FROM roles_pyme';
    const queryAreas = 'SELECT * FROM areapymes';

    connection.query(queryRoles, (errRoles, rolesResults) => {
        if (errRoles) throw errRoles;

        connection.query(queryAreas, (errAreas, areasResults) => {
            if (errAreas) throw errAreas;

            res.json({ roles: rolesResults, areas: areasResults });
        });
    });
});

// Ruta para agregar un nuevo usuario
app.post('/usuarios/add', (req, res) => {
    const { NombreUsuario, Correo, Contraseña, IDRol, IDArea } = req.body;

    if (!NombreUsuario || !Correo || !Contraseña || !IDRol || !IDArea) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    const query = 'INSERT INTO Usuarios (NombreUsuario, Correo, Contraseña, IDRol, IDArea) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [NombreUsuario, Correo, Contraseña, IDRol, IDArea], (err, result) => {
        if (err) {
            console.error('Error al agregar el usuario:', err);
            return res.status(500).send('Error al agregar el usuario');
        }
        res.redirect('/usuarios');
    });
});

// Ruta para eliminar un usuario
app.post('/usuarios/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Usuarios WHERE IDUsuario = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            return res.status(500).send('Error al eliminar el usuario');
        }
        res.redirect('/usuarios');  // Después de eliminar, redirige a la lista de usuarios
    });
});

// Rutas para el módulo Áreas de Pymes
// Ruta para mostrar la vista de gestión de áreas de Pymes
app.get('/areapymes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'areapymes.html'));
});

// Ruta para obtener todas las áreas de Pymes
app.get('/api/areapymes', (req, res) => {
    const query = 'SELECT * FROM areapymes';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Ruta para agregar una nueva área de Pyme
app.post('/areapymes/add', (req, res) => {
    const { nombrearea } = req.body;

    if (!nombrearea) {
        return res.status(400).send('El nombre del área es obligatorio');
    }

    const query = 'INSERT INTO areapymes (nombrearea) VALUES (?)';
    connection.query(query, [nombrearea], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send('El área ya existe');
            }
            throw err;
        }
        res.redirect('/areapymes');
    });
});

// Ruta para eliminar un área de Pyme
app.post('/areapymes/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM areapymes WHERE id_area = ?';
    connection.query(query, [id], (err, result) => {
        if (err) throw err;
        res.redirect('/areapymes');
    });
});





// Rutas para el módulo Roles Pyme
// Ruta para mostrar la vista de gestión de roles de Pymes
app.get('/rolespyme', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rolespyme.html'));
});

// Ruta para obtener todos los roles de Pymes
app.get('/api/rolespyme', (req, res) => {
    const query = 'SELECT * FROM roles_pyme';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Ruta para agregar un nuevo rol de Pyme
app.post('/rolespyme/add', (req, res) => {
    const { nombre_rol } = req.body;

    if (!nombre_rol) {
        return res.status(400).send('El nombre del rol es obligatorio');
    }

    const query = 'INSERT INTO roles_pyme (nombre_rol) VALUES (?)';
    connection.query(query, [nombre_rol], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send('El rol ya existe');
            }
            throw err;
        }
        res.redirect('/rolespyme');
    });
});

// Ruta para eliminar un rol de Pyme
app.post('/rolespyme/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM roles_pyme WHERE id_rol = ?';
    connection.query(query, [id], (err, result) => {
        if (err) throw err;
        res.redirect('/rolespyme');
    });
});



// Ruta para manejar el cierre de sesión
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar la sesión');
        }
        res.redirect('/');  // Redirige a la página de inicio de sesión
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});