var express = require('express');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion')

var app = express();

var User = require('../models/user');


//====================================================================
// Buscar todos los registros con los campos name, surname, img, role
//====================================================================
app.get( '/', (request, response, next) => {
    // Buscar todos los registros con los campos name, surname, img, role
    User.find({}, 'name surname email img role').exec((error, users) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error cargando usuarios',
                errors: error
            });
        }
        response.status(200).json({
            ok: true,
            users
        });
    })
});



//===========================================
// Actualizar un usuario
//===========================================

app.put('/:id', mdAutenticacion.verificaToken, (request, response) => {
    var id = request.params.id;
    var body = request.body;

    User.findById(id, (error, userFound) => {
        if ( error ) {
            return response.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: error
            });
        }
        if ( !userFound ) {
            return response.status(400).json({
                ok: false,
                messages: 'El usuario con el id' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        userFound.name = body.name;
        userFound.surname = body.surname;
        userFound.email = body.email;
        userFound.role = body.role;

        userFound.save( (error, userSave) => {
            if ( error ) {
                return response.status(500).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    errors: error
                });
            }
            userSave.password = ':)'
            response.status(200).json({
                ok: true,
                user: userSave
            });
        });
    });
});

//========================================
// Crear un usuario
//========================================
app.post('/', mdAutenticacion.verificaToken, (request, response) => {

    var body = request.body;

    var user = new User({
        name: body.name,
        surname: body.surname,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        img: body.img,
        role: body.role
    });

    user.save( (err, userSave) => {
        if (err) {
            return response.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: err
            })
        }
        response.status(201).json({
            ok: true,
            userSave,
            userToken: request.user
        });
    });
});

//========================================
// Borrar un usuario por el id
//========================================

app.delete('/:id', mdAutenticacion.verificaToken, (request, response) => {
     var id = request.params.id;

     User.findByIdAndRemove(id, ( error, userErase ) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error al borrar usuario',
                errors: error
            });
        }

         if (!userErase) {
             return response.status(400).json({
                 ok: false,
                 message: 'No existe un usuario con ese id',
                 errors: { messages: 'No existe un usuario con ese id' }
             });
         }
        response.status(200).json({
            ok: true,
            user: userErase
        });
     });
});

module.exports = app;