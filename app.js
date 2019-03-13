// Archivo punto de entrada para la aplicación, contiene el código JavaScript que inicializa el servidor, base de datos, autenticación, etc.

// Requires: importación de librerías. Que se ocupan para un funcionamiento.
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Inicializar variables.
var app = express();

// Body Parse
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/db_jacapp', (error, response) => {
    if ( error ) throw error;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads', {'icons': true}));


// Rutas
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);


// Escuchar peticiones.
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online')
});
