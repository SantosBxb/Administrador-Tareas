const mongoose = require('mongoose');

const ProyectoSchema = mongoose.Schema({ 
  nombre: {
    type: String,
    require: true,
    trim: true
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId, //cada usuario tendra su propio id
    ref: "Usuario" // debe ser el mismo nombre del modelo del usuario
  },
  creado: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Proyecto", ProyectoSchema);