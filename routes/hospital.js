var express = require('express');

var app = express();
var Hospital = require('../models/hospital');
var mdAutenticacion = require('../middlewares/autenticacion');

app.get( '/', (request, response) => {
    let desde = request.query.desde || 0;
    desde = Number(desde);
    Hospital.find({}).populate('usuario', 'name email').skip(desde).limit(4).exec( (error, hospitales) => {
       if (error) {
           return response.status(500).json({
               ok: false,
               message: 'Error al buscar los hospitales',
               errors: error
           });
       }
        Hospital.count({}, (error, conteo) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: error
                });
            }
            response.status(200).json({
                ok: true,
                hospital: hospitales,
                total: conteo
            });
        });
    })
});

app.post( '/', mdAutenticacion.verificaToken, (request, response) => {
    var body = request.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: request.user._id
    });
    hospital.save((error, hospitalGuardado) => {
       if (error) {
           return response.status(400).json({
               ok: false,
               mensaje: 'Error al guardar hospital',
               errors: error
           });
       }
       response.status(201).json({
           ok: true,
           hospital: hospitalGuardado
       });
    })
});

app.put('/:id', mdAutenticacion.verificaToken, (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Hospital.findById(id, (error, hospitalBuscado) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar hospital',
                errors: error
            });
        }

        if (!hospitalBuscado) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                error: { message: 'No existe un hospital con ese id' }
            })
        }

        hospitalBuscado.nombre = body.nombre;
        hospitalBuscado.img = body.img;

        hospitalBuscado.save((error, hospitalGuardado) => {
            if (error) {
                return response.status(500).json({
                    ok: true,
                    mensaje: 'Error al actualizar hospital',
                    errors: error
                });
            }
            response.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});

app.delete('/:id', mdAutenticacion.verificaToken, (request, response) => {
    var id = request.params.id;

    Hospital.findByIdAndRemove(id, (error, hospitalBorrado) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar hospital',
                errors: error
            });
        }

        if (!hospitalBorrado) {
            return response.status(400).json({
               ok: false,
               mensaje: 'El hospital con el id ' + id + ' no existe',
               errors: { menssage: 'No existe un hospital con ese id' }
            });
        }

        response.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});

module.exports = app;


