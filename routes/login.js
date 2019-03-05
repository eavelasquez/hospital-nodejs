var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var User = require('../models/user');

app.post('/', (request, response) => {

    var body = request.body;

    User.findOne({ email: body.email }, (error, userDB) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: error
            });
        }

        if (!userDB) {
            return response.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email',
                errors: error
            });
        }

        if (!bcrypt.compareSync( body.password, userDB.password )) {
            return response.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password',
                errors: error
            });
        }

        // Crear un token
        userDB.password = ':)';
        var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 28800 });

        response.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id
        });
    });
});

module.exports = app;

