// se debe exportar el modelo a utilizar
const Usuario = require(".././models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.autenticarUsuario = async (req, res) => {
  // revisar si hay errores
  const errores = validationResult(req);
  if (!errores) {
    return res.status(400).json({ errors: errores.array() });
  }

  // extraer email y password
  const { email, password } = req.body;

  try {
    // revisar que sea un usuario registrado
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    // revisar password
    const passCorrecto = await bcryptjs.compare(password, usuario.password)
    if(!passCorrecto) {
      return res.status(400).json({ msg: "El password es incorrecto "})
    }

    // si todo esta bien se crea el jwt
    const payload ={
      usuario: {
        id: usuario.id,
      }
    };

    // firmar el jwt
    jwt.sign(payload, process.env.SECRETA, {
      expiresIn: 3600 //expira enn 1 hora
    }, (error, token)=>{
      if(error) throw error;
      
      // mensaje de confirmacion 
      res.json({token})
      
    })

  } catch (error) {
    console.log(error);
  }
};

// obtiene el usuario autenticado 
exports.usuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    res.json({usuario});
  } catch (error) {
    console.log(eror);
    res.status(500).json({msg: "Hubo un error"})
  }
}
