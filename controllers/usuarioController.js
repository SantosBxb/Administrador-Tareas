// se debe exportar el modelo a utilizar
const Usuario = require(".././models/Usuario");
const bcryptjs = require("bcryptjs");
const {validationResult} = require("express-validator")
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {

  // revisar si hay errores
  const errores = validationResult(req);
  if(!errores.isEmpty()){
    return res.status(400).json({error: errores.array()})
  }

  // extraer email y password
  const {email, password} = req.body;
  
  try {
    // verifica si ya existe un usuario con ese email 
    let usuario = await Usuario.findOne({email})
    if(usuario){
      return res.status(400).json({msg: "El usuario ya existe"})
    }

    // crea nuevo usuario
    usuario = new Usuario(req.body);

    // hashear password, se hace despues de verificar que el usuario aun no esta registrado 
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    //  guardar usuario
    await usuario.save();

    //crear y firmar jwt
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
    res.status(400).send("Hubo un error")
  }
};
