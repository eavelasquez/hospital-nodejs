var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (request, response) => {

    var img = request.params.img;
    var tipo = request.params.tipo;

    let pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);
    if (fs.existsSync(pathImagen)) {
        response.sendFile(pathImagen);
    }
    else {
        var pathNoImagen = path.resolve(__dirname, 'assets/no-img.jpg');
        response.sendFile(pathNoImagen);
    }

});

module.exports = app;
