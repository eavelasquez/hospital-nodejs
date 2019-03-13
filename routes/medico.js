let express = require('express');
let app = express();
let Medico = require('../models/medico');
let mdAutenticacion = require('../middlewares/autenticacion');

app.get('/', (request, response) => {

    let desde = request.query.desde || 0;
    desde = Number(desde);

    Medico.find({}).skip(desde).limit(4).populate('usuario', 'name email').populate('hospital').exec((error, medicos) => {
        if (error) {
            return response.status(500).json({
               ok: false,
               mensaje: 'Error al buscar los médicos',
               errors: error
            });
        }

        Medico.count({}, (error, conteo) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando médicos',
                    errors: error
                });
            }
            response.status(200).json({
                ok: true,
                medico: medicos,
                total: conteo
            });
        });
    });
});

app.post('/', mdAutenticacion.verificaToken, (request, response) => {
    let body = request.body;

    let medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: request.user._id,
        hospital: body.hospital
    });
    // hospital = body.hospital._id;

    medico.save((error, medicoGuardado) => {
       if (error) {
           return response.status(400).json({
               ok: false,
               mensaje: 'Error al guardar médico',
               errors: error
           });
       }
       response.status(201).json({
           ok: true,
           medico: medicoGuardado
       });
    });
});

app.put('/:id', mdAutenticacion.verificaToken, (request, response) => {
    let id = request.params.id;
    let body = request.body;

    Medico.findById(id, (error, medicoBuscado) => {
       if (error) {
           return response.status(500).json({
               ok: false,
               mensaje: 'Error al actualizar médico',
               errors: error
           });
       }

       if (!medicoBuscado) {
           return response.status(400).json({
               ok: false,
               mensaje: 'El médico con el id ' + id + ' no existe',
               error: { message: 'No existe un médico con ese id' }
           })
       }

       medicoBuscado.nombre = body.nombre;
       medicoBuscado.hospital = body.hospital;
       // medicoBuscado.hospital = body.hospital._id;

       medicoBuscado.save((error, medicoGuardado) => {
          if (error) {
              return response.status(500).json({
                  ok: false,
                  mensaje: 'Error al guardar médico actualizado',
                  errors: error
              });
          }
          response.status(200).json({
              ok: true,
              medico: medicoGuardado
          })
       });
    });
});

app.delete('/:id', mdAutenticacion.verificaToken, (request, response) => {
   let id = request.params.id;
   Medico.findByIdAndRemove(id, (error, medicoBorrado) => {
      if (error) {
          return response.status(500).json({
              ok: false,
              mensaje: 'Error al eliminar médico',
              errors: error
          });
      }
      if (!medicoBorrado) {
          return response.status(400).json({
              ok: false,
              mensaje: 'El médico con el id ' + id + ' no existe',
              error: { message: 'No existe un médico con ese id'}
          });
      }
      response.status(200).json({
          ok: true,
          medico: medicoBorrado
      });
   });
});

module.exports = app;
