// Importación Mongoose para usar funciones.
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Función que define esquemas.
var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var userShcema = new Schema ({
    name: { type: String, required: [true, 'Campo obligatorio'] },
    surname: { type: String, required: [true, 'Campo obligatorio'] },
    email: { type: String, unique: true, required: [true, 'Campo obligatorio'] },
    password: { type: String, required: [true, 'Campo obligatorio'] },
    img: { type: String, required: false },
    role: { type: String, required: [true, "Campo obligatorio"], default: 'User', enum: rolesValidos }
});

userShcema.plugin(uniqueValidator, {message: '{PATH} debe ser único'})
module.exports = mongoose.model( 'tbl_users', userShcema );