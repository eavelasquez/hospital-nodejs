// Archivo punto de entrada para la aplicación, contiene el código JavaScript que inicializa el servidor, base de datos, autenticación, etc.

// Requires: importación de librerías. Que se ocupan para un funcionamiento.
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables.
var app = express();

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/db_jacapp', (error, response) => {
    if ( error ) throw error;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.get( '/', (request, response, next) => {
    response.status(200).json({
        ok: true,
        message: 'Petición realizada correctamente'
    });
});

// Escuchar peticiones.
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online')
});