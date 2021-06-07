const mongoose = require("mongoose");

const UsuariosSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true, //debe ser unico
  },
  password: {
    type:String, 
    required:true, 
    trim: true},
  registro: {
    type: Date,
    default: Date.now() //por defecto se asigna la hora en la que se registre
  },
});

//  se regrista el modelo Usuario con el Schema UsuariosSchema
module.exports = mongoose.model("Usuario", UsuariosSchema);
