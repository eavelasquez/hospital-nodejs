const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

const User = require('../models/user');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
// default options
app.use(fileUpload());

app.put('/:tipo/:id', (request, response) => {
    let tipo = request.params.tipo;
    let id = request.params.id;

    // Tipos colección
    let tiposValidos = ['hospitales', 'medicos', 'user'];
    if ( tiposValidos.indexOf( tipo ) < 0 ) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }

    if (!request) {
        return response.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    let archivo = request.files.img;
    let nombreCortado = archivo.name.split('.');
    let extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo estas extensiones aceptamos
    let extensionesValidas = ['png', 'jpng', 'jpg', 'gif'];

    if (extensionesValidas.indexOf( extensionArchivo ) < 0 ) {
        response.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover el archivo del temporal a una dirección particular (path)
    let path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, error => {
       if (error) {
           return response.status(500).json({
               ok: false,
               mensaje: 'No se cargó la imagen',
               errors: error
           });
       }

       subirTipo( tipo, id, nombreArchivo, response );
    });

});

function subirTipo( tipo, id, nombreArchivo, response ) {
    if (tipo === 'user') {
        User.findById( id, (error, usuario) => {

            if (!usuario) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: error
                });
            }
            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Hay un error',
                    errors: error
                });
            }
            let pathAntiguo = './uploads/user/' + usuario.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathAntiguo)) {
                fs.unlinkSync(pathAntiguo);
            }

            usuario.img = nombreArchivo;
            usuario.save((error, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario con su imagen',
                        errors: error
                    });
                }
                return response.status(200).json({
                   ok: true,
                   mensaje: 'Imagen de usuario actualizada',
                   usuario: usuarioActualizado
                });
            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (error, medico) => {
            if (!medico) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Médico no existe',
                    errors: error
                });
            }

            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Hay un error',
                    errors: error
                });
            }

            let pathAntiguo = './uploads/medicos/' + medico.img;
            if (fs.existsSync(pathAntiguo)) {
                fs.unlinkSync(pathAntiguo);
            }

            medico.img = nombreArchivo;
            medico.save((error, medicoActualizado) => {
               if (error) {
                   return response.status(400).json({
                       ok: false,
                       mensaje: 'Error al actualizar médico con su imagen',
                       errors: error
                   });
               }
               response.status(200).json({
                   ok: true,
                   mensaje: 'Imagen de usuario actualizada',
                   medico: medicoActualizado
               });
            });
        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (error, hospital) => {

            if (!hospital) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: error
                });
            }

           if (error) {
               return response.stat(500).json({
                  ok: false,
                  mensaje: 'Hubo un error',
                  errors: error
               });
           }


           let pathAntiguo = './uploads/hospitales/' + hospital.img;
           if (fs.existsSync(pathAntiguo)) {
               fs.unlinkSync(pathAntiguo);
           }

           hospital.img = nombreArchivo;
           hospital.save((error, hospitalActualizado) => {
              if (error) {
                  return response.stat(500).json({
                     ok: false,
                     mensaje: 'Error al actualizar hospital con su imagen',
                     errors: error
                  });
              }
              response.status(200).json({
                  ok: true,
                  mensaje: 'Hospital actualizado con imagen',
                  hospital: hospitalActualizado
              });
           });
        });
    }
}

module.exports = app;
