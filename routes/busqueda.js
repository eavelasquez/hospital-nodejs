let express = require('express');
let app = express();

let Hospital = require('../models/hospital');
let Medico = require('../models/medico');
let User = require('../models/user');

app.get('/coleccion/:tabla/:busqueda', (request, response) => {
    let tabla = request.params.tabla;
    let busqueda = request.params.busqueda;
    let regex = new RegExp( busqueda, 'i' );

    let promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        default: return response.status(400).json({
            ok: false,
            mensaje: 'Los tipos de búsqueda son: usuarios, médicos, y hospitales',
            error: { message: 'Tipo de tabla / colección no válido' }
        });
    }
    promesa.then( data => {
       response.status(200).json({
         ok: true,
         [tabla]: data
       });
    });
});

app.get('/todo/:busqueda', (request, response) => {
    let busqueda = request.params.busqueda;
    let regex = new RegExp( busqueda, 'i' );

    Promise.all([buscarHospitales(busqueda, regex), buscarMedicos(busqueda, regex), buscarUsuarios(busqueda, regex)])
        .then(respuestas => {
            response.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                hospital: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

function buscarHospitales( busqueda, regex ) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex }).populate('usuario', 'name email').exec( (error, hospitales) => {

            if (error) {
                reject('Error al cargar hospitales. ', error);
            }
            else {
                resolve(hospitales);
            }

        });
    });

}

function buscarMedicos( busqueda, regex ) {

    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex }).populate('usuario', 'name email').populate('hospital').exec((error, medicos) => {

            if (error) {
                reject('Error al cargar hospitales. ', error);
            }
            else {
                resolve(medicos);
            }

        });
    });

}

function buscarUsuarios( busqueda, regex ) {

    return new Promise((resolve, reject) => {
        User.find({}, 'name surname email role').or([{ 'nombre': regex }, { 'email': regex }]).exec((error, usuarios) => {
            if (error) {
                reject('Error al cargar usuarios. ', error);
            }
            else {
                resolve( usuarios );
            }
        });
    });

}

module.exports = app;
