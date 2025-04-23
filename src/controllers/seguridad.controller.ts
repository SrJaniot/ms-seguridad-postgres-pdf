// Uncomment these imports to begin using these cool features!

import {getModelSchemaRef, HttpErrors, post,get, Request, requestBody, Response, response, RestBindings} from '@loopback/rest';
import {CerrarSesion, Credenciales, FactorDeAutenticacionPorCodigo, HashValidacionUsuario, Login, TokenModel, Usuario, UsuarioInsert, UsuarioInsertActivacion} from '../models';
import {repository} from '@loopback/repository';
import {inject, service} from '@loopback/core';
import {LoginRepository, UsuarioRepository} from '../repositories';
import {SeguridadService} from '../services';
import {ConfiguracionSeguridad} from '../config/seguridad.config';
import {authenticate} from '@loopback/authentication';













export class SeguridadController {
  constructor(
    //repotorios------------------------------------------------------------------------
    //llamado al repositorio de usuario para poder insertar en la base de datos mongo
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    //llamado al repositorio de login para poder insertar en la base de datos mongo
    @repository(LoginRepository)
    public loginRepository: LoginRepository,

    //servicios-------------------------------------------------------------------------
    //inyeccion para poder utilizar el servicio de seguridad
    @service(SeguridadService)
    public seguridadService: SeguridadService,


    @inject(RestBindings.Http.REQUEST) private request: Request




  ) {}

  //----------------------------------------------------------------METODOS PARA EL REGISTRO----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



  // este sera el registro publico de los USUARIOS
  //este enpoint debe ser unicamente usado por el administrador                     --OJO--
  //METODO POST PARA INSERTAR DATOS USUARIO EN LA BASE DE DATOS POSTGRES
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @post('/funcion-inserta-usuario-rolAdministrador-SINHASHDEVALIDACION')
  @response(200, {
    description: ' db postgres ',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UsuarioInsert),

      },
    },
  })
  async crearUsuario_SINHASH(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioInsert),
        },
      },
    })
    data: UsuarioInsert,
  ): Promise<object> {
    try {
      //CREAR UN OBJETO DE TIPO USUARIO PARA INSERTARLO EN LA BASE DE DATOS
      let usuario: Usuario = new Usuario();
      usuario.id_usuario = data.id_usuario;
      usuario.nombre = data.nombre;
      usuario.correo = data.correo.toLowerCase();
      usuario.celular = data.celular;
      //ROL APRENDIZ
      usuario.rolid = ConfiguracionSeguridad.rolAdministradorID;
      //CIFRAR LA CONTRASEÑA
      let clavecifrada = this.seguridadService.encriptartexto(data.clave);
      //ASIGNAR LA CLAVE CIFRADA AL USUARIO
      usuario.clave = clavecifrada;
      //console.log(params);
      usuario.estadovalidacion = true;
      usuario.aceptado = true;
      //IF QUE PERMITE SABER SI EL CORREO YA EXISTE EN LA BASE DE DATOS POSTGRES
      let existeCorreo = await this.usuarioRepository.findOne({
        where: {
          correo: usuario.correo
        }
      });
      if (existeCorreo) {
        return {
          "CODIGO": 3,
          "MENSAJE": "El correo ya existe en la base de datos",
          "DATOS": "El correo ya existe en la base de datos"
        };
      }
      //IF QUE ME PERMITE SABER SI EL ID_USUARIO YA EXISTE EN LA BASE DE DATOS POSTGRES
      let existeIdUsuario = await this.usuarioRepository.findOne({
        where: {
          id_usuario: usuario.id_usuario
        }
      });
      if (existeIdUsuario) {
        return {
          "CODIGO": 3,
          "MENSAJE": "El id_usuario (NUM DOC) ya existe en la base de datos",
          "DATOS": "El id_usuario (NUM DOC) ya existe en la base de datos"
        };
      }

      const result = await this.usuarioRepository.create(usuario);
      //eliminar la clave encriptada
      result.clave = "";

      //ENVIAR CORREO ELECTRONICO DE CONFIRMACION

      return {
        "CODIGO": 200,
        "MENSAJE": "Operación exitosa",
        "DATOS": result
      };
    } catch (err) {
      throw {
        "CODIGO": 500,
        "MENSAJE": `Error al realizar las operaciones: ${err}`,
        "DATOS": `Error al realizar las operaciones: ${err}`
      };
    }
  }





  // este sera el registro publico de los USUARIOS
  //este enpoint debe ser unicamente usado por el administrador                     --OJO--
  //METODO POST PARA INSERTAR DATOS USUARIO EN LA BASE DE DATOS POSTGRES
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @post('/funcion-inserta-usuario-rolAdministrador-CONACTIVACION')
  @response(200, {
    description: ' db postgres ',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UsuarioInsertActivacion),

      },
    },
  })
  async crearUsuario_CON_ACTIVACION(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioInsertActivacion),
        },
      },
    })
    data: UsuarioInsertActivacion,
  ): Promise<object> {
    try {
      //CREAR UN OBJETO DE TIPO USUARIO PARA INSERTARLO EN LA BASE DE DATOS
      let usuario: Usuario = new Usuario();
      usuario.id_usuario = data.id_usuario;
      usuario.nombre = data.nombre;
      usuario.correo = data.correo.toLowerCase();
      usuario.celular = data.celular;
      //ROL APRENDIZ
      usuario.rolid = ConfiguracionSeguridad.rolAdministradorID;
      //CIFRAR LA CONTRASEÑA
      let clavecifrada = this.seguridadService.encriptartexto(data.clave);
      //ASIGNAR LA CLAVE CIFRADA AL USUARIO
      usuario.clave = clavecifrada;
      //console.log(params);
      usuario.estadovalidacion = true;
      usuario.aceptado = data.cuenta_activa;
      //IF QUE PERMITE SABER SI EL CORREO YA EXISTE EN LA BASE DE DATOS POSTGRES
      let existeCorreo = await this.usuarioRepository.findOne({
        where: {
          correo: usuario.correo
        }
      });
      if (existeCorreo) {
        return {
          "CODIGO": 3,
          "MENSAJE": "El correo ya existe en la base de datos",
          "DATOS": "El correo ya existe en la base de datos"
        };
      }
      //IF QUE ME PERMITE SABER SI EL ID_USUARIO YA EXISTE EN LA BASE DE DATOS POSTGRES
      let existeIdUsuario = await this.usuarioRepository.findOne({
        where: {
          id_usuario: usuario.id_usuario
        }
      });
      if (existeIdUsuario) {
        return {
          "CODIGO": 3,
          "MENSAJE": "El id_usuario (NUM DOC) ya existe en la base de datos",
          "DATOS": "El id_usuario (NUM DOC) ya existe en la base de datos"
        };
      }

      const result = await this.usuarioRepository.create(usuario);
      //eliminar la clave encriptada
      result.clave = "";

      //ENVIAR CORREO ELECTRONICO DE CONFIRMACION

      return {
        "CODIGO": 200,
        "MENSAJE": "Operación exitosa",
        "DATOS": result
      };
    } catch (err) {
      throw {
        "CODIGO": 500,
        "MENSAJE": `Error al realizar las operaciones: ${err}`,
        "DATOS": `Error al realizar las operaciones: ${err}`
      };
    }
  }





  //METODO POST PARA ACTUALIZAR DATOS USUARIO EN LA BASE DE DATOS POSTGRES
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.editarAccion]
  })
@post('/funcion-actualiza-usuario-rolAdministrador-CONACTIVACION')
@response(200, {
  description: ' db postgres ',
  content: {
    'application/json': {
      schema: getModelSchemaRef(UsuarioInsertActivacion),
    },
  },
})
async actualizarUsuario_CON_ACTIVACION(
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(UsuarioInsertActivacion),
      },
    },
  })
  data: UsuarioInsertActivacion,
): Promise<object> {
  try {
    //CREAR UN OBJETO DE TIPO USUARIO PARA ACTUALIZARLO EN LA BASE DE DATOS
    let usuario: Usuario = new Usuario();
    usuario.id_usuario = data.id_usuario;
    usuario.nombre = data.nombre;
    usuario.correo = data.correo.toLowerCase();
    usuario.celular = data.celular;
    //ROL APRENDIZ
    usuario.rolid = ConfiguracionSeguridad.rolAdministradorID;
    //CIFRAR LA CONTRASEÑA
    let clavecifrada = this.seguridadService.encriptartexto(data.clave);
    //ASIGNAR LA CLAVE CIFRADA AL USUARIO
    usuario.clave = clavecifrada;
    usuario.estadovalidacion = true;
    usuario.aceptado = data.cuenta_activa;

    //IF QUE PERMITE SABER SI EL CORREO YA EXISTE EN LA BASE DE DATOS POSTGRES
    let existeCorreo = await this.usuarioRepository.findOne({
      where: {
        correo: usuario.correo,
        id_usuario: { neq: usuario.id_usuario } // Excluir el usuario actual
      }
    });
    if (existeCorreo) {
      return {
        "CODIGO": 3,
        "MENSAJE": "El correo ya existe en la base de datos",
        "DATOS": "El correo ya existe en la base de datos"
      };
    }

    //IF QUE ME PERMITE SABER SI EL ID_USUARIO YA EXISTE EN LA BASE DE DATOS POSTGRES
    let existeIdUsuario = await this.usuarioRepository.findOne({
      where: {
        id_usuario: usuario.id_usuario
      }
    });
    if (!existeIdUsuario) {
      return {
        "CODIGO": 3,
        "MENSAJE": "El id_usuario (NUM DOC) no existe en la base de datos",
        "DATOS": "El id_usuario (NUM DOC) no existe en la base de datos"
      };
    }

    // Actualizar el usuario
    await this.usuarioRepository.updateById(usuario.id_usuario, usuario);

    // Obtener el usuario actualizado
    const result = await this.usuarioRepository.findById(usuario.id_usuario);
    // Eliminar la clave encriptada
    result.clave = "";

    //ENVIAR CORREO ELECTRONICO DE CONFIRMACION

    return {
      "CODIGO": 200,
      "MENSAJE": "Operación exitosa",
      "DATOS": result
    };
  } catch (err) {
    throw {
      "CODIGO": 500,
      "MENSAJE": `Error al realizar las operaciones: ${err}`,
      "DATOS": `Error al realizar las operaciones: ${err}`
    };
  }
}





  // este sera el registro publico de los USUARIOS
  //este enpoint debe ser unicamente usado por el administrador                     --OJO--
  //METODO POST PARA INSERTAR DATOS USUARIO EN LA BASE DE DATOS POSTGRES
  /** 
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuinstitucion, ConfiguracionSeguridad.editarAccion]
  })
  */
  @post('/funcion-inserta-usuario-rolusuario-CONACTIVACION')
  @response(200, {
    description: ' db postgres ',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UsuarioInsertActivacion),

      },
    },
  })
  async crearUsuario_CON_ACTIVACION_TUTOR(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioInsertActivacion),
        },
      },
    })
    data: UsuarioInsertActivacion,
  ): Promise<object> {
    try {
      //CREAR UN OBJETO DE TIPO USUARIO PARA INSERTARLO EN LA BASE DE DATOS
      let usuario: Usuario = new Usuario();
      usuario.id_usuario = data.id_usuario;
      usuario.nombre = data.nombre;
      usuario.correo = data.correo.toLowerCase();
      usuario.celular = data.celular;
      //ROL APRENDIZ
      usuario.rolid = ConfiguracionSeguridad.rolUsuarioID;
      //CIFRAR LA CONTRASEÑA
      let clavecifrada = this.seguridadService.encriptartexto(data.clave);
      //ASIGNAR LA CLAVE CIFRADA AL USUARIO
      usuario.clave = clavecifrada;
      //console.log(params);
      usuario.estadovalidacion = true;
      usuario.aceptado = data.cuenta_activa;
      //IF QUE PERMITE SABER SI EL CORREO YA EXISTE EN LA BASE DE DATOS POSTGRES
      let existeCorreo = await this.usuarioRepository.findOne({
        where: {
          correo: usuario.correo
        }
      });
      if (existeCorreo) {
        return {
          "CODIGO": 3,
          "MENSAJE": "El correo ya existe en la base de datos",
          "DATOS": "El correo ya existe en la base de datos"
        };
      }
      //IF QUE ME PERMITE SABER SI EL ID_USUARIO YA EXISTE EN LA BASE DE DATOS POSTGRES
      let existeIdUsuario = await this.usuarioRepository.findOne({
        where: {
          id_usuario: usuario.id_usuario
        }
      });
      if (existeIdUsuario) {
        return {
          "CODIGO": 3,
          "MENSAJE": "El id_usuario (NUM DOC) ya existe en la base de datos",
          "DATOS": "El id_usuario (NUM DOC) ya existe en la base de datos"
        };
      }

      const result = await this.usuarioRepository.create(usuario);
      //eliminar la clave encriptada
      result.clave = "";

      //ENVIAR CORREO ELECTRONICO DE CONFIRMACION

      return {
        "CODIGO": 200,
        "MENSAJE": "Operación exitosa",
        "DATOS": result
      };
    } catch (err) {
      throw {
        "CODIGO": 500,
        "MENSAJE": `Error al realizar las operaciones: ${err}`,
        "DATOS": `Error al realizar las operaciones: ${err}`
      };
    }
  }






@post('/funcion-actualiza-usuario-rolTutor-CONACTIVACION')
@response(200, {
  description: ' db postgres ',
  content: {
    'application/json': {
      schema: getModelSchemaRef(UsuarioInsertActivacion),
    },
  },
})
async actualizarUsuario_CON_ACTIVACION_TUTOR(
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(UsuarioInsertActivacion),
      },
    },
  })
  data: UsuarioInsertActivacion,
): Promise<object> {
  try {
    //CREAR UN OBJETO DE TIPO USUARIO PARA ACTUALIZARLO EN LA BASE DE DATOS
    let usuario: Usuario = new Usuario();
    usuario.id_usuario = data.id_usuario;
    usuario.nombre = data.nombre;
    usuario.correo = data.correo.toLowerCase();
    usuario.celular = data.celular;
    //ROL APRENDIZ
    usuario.rolid = ConfiguracionSeguridad.rolUsuarioID;
    //CIFRAR LA CONTRASEÑA
    let clavecifrada = this.seguridadService.encriptartexto(data.clave);
    //ASIGNAR LA CLAVE CIFRADA AL USUARIO
    usuario.clave = clavecifrada;
    usuario.estadovalidacion = true;
    usuario.aceptado = data.cuenta_activa;

    //IF QUE PERMITE SABER SI EL CORREO YA EXISTE EN LA BASE DE DATOS POSTGRES
    let existeCorreo = await this.usuarioRepository.findOne({
      where: {
        correo: usuario.correo,
        id_usuario: { neq: usuario.id_usuario } // Excluir el usuario actual
      }
    });
    if (existeCorreo) {
      return {
        "CODIGO": 3,
        "MENSAJE": "El correo ya existe en la base de datos",
        "DATOS": "El correo ya existe en la base de datos"
      };
    }

    //IF QUE ME PERMITE SABER SI EL ID_USUARIO YA EXISTE EN LA BASE DE DATOS POSTGRES
    let existeIdUsuario = await this.usuarioRepository.findOne({
      where: {
        id_usuario: usuario.id_usuario
      }
    });
    if (!existeIdUsuario) {
      return {
        "CODIGO": 3,
        "MENSAJE": "El id_usuario (NUM DOC) no existe en la base de datos",
        "DATOS": "El id_usuario (NUM DOC) no existe en la base de datos"
      };
    }

    // Actualizar el usuario
    await this.usuarioRepository.updateById(usuario.id_usuario, usuario);

    // Obtener el usuario actualizado
    const result = await this.usuarioRepository.findById(usuario.id_usuario);
    // Eliminar la clave encriptada
    result.clave = "";

    //ENVIAR CORREO ELECTRONICO DE CONFIRMACION

    return {
      "CODIGO": 200,
      "MENSAJE": "Operación exitosa",
      "DATOS": result
    };
  } catch (err) {
    throw {
      "CODIGO": 500,
      "MENSAJE": `Error al realizar las operaciones: ${err}`,
      "DATOS": `Error al realizar las operaciones: ${err}`
    };
  }
}





  // este sera el registro publico de los USUARIOS
  //METODO POST PARA INSERTAR DATOS USUARIO EN LA BASE DE DATOS POSTGRES CON HASH DE VALIDACION
  //publico
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.editarAccion]
  })
  @post('/funcion-inserta-usuario-roladministrador-CONHASHDEVALIDACION')
  @response(200, {
    description: ' db postgres ',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UsuarioInsert),

      },
    },
  })
  async crearUsuario_PUBLICO(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioInsert),
        },
      },
    })
    data: UsuarioInsert,
  ): Promise<object> {
    try {
      //CREAR UN OBJETO DE TIPO USUARIO PARA INSERTARLO EN LA BASE DE DATOS
      let usuario: Usuario = new Usuario();
      usuario.id_usuario = data.id_usuario;
      usuario.nombre = data.nombre;
      usuario.correo = data.correo.toLowerCase();
      usuario.celular = data.celular;
      //ROL APRENDIZ
      usuario.rolid = ConfiguracionSeguridad.rolAdministradorID;
      //CIFRAR LA CONTRASEÑA
      let clavecifrada = this.seguridadService.encriptartexto(data.clave);
      //ASIGNAR LA CLAVE CIFRADA AL USUARIO
      usuario.clave = clavecifrada;
      //console.log(params);

      //hash de validacion para el correo
      let hash = this.seguridadService.crearTextoAleatoria(100);
      usuario.hashvalidacion = hash;
      usuario.estadovalidacion = false;
      usuario.aceptado = false;
      //IF QUE PERMITE SABER SI EL CORREO YA EXISTE EN LA BASE DE DATOS MONGO
      let existeCorreo = await this.usuarioRepository.findOne({
        where: {
          correo: usuario.correo
        }
      });
      if (existeCorreo) {
        return {
          "CODIGO": 3,
          "MENSAJE": "El correo ya existe en la base de datos",
          "DATOS": "El correo ya existe en la base de datos"
        };
      }
      //IF QUE ME PERMITE SABER SI EL ID_USUARIO YA EXISTE EN LA BASE DE DATOS MONGO
      let existeIdUsuario = await this.usuarioRepository.findOne({
        where: {
          id_usuario: usuario.id_usuario
        }
      });
      if (existeIdUsuario) {
        return {
          "CODIGO": 3,
          "MENSAJE": "El id_usuario (NUM DOC) ya existe en la base de datos",
          "DATOS": "El id_usuario (NUM DOC) ya existe en la base de datos"
        };
      }
      const result = await this.usuarioRepository.create(usuario);
      //eliminar la clave encriptada
      result.clave = "";
      //ENVIAR CORREO ELECTRONICO DE CONFIRMACION CON EL HASH DE VALIDACION

      return {
        "CODIGO": 200,
        "MENSAJE": "Operación exitosa",
        "DATOS": result
      };
    } catch (err) {
      throw {
        "CODIGO": 500,
        "MENSAJE": `Error al realizar las operaciones: ${err}`,
        "DATOS": `Error al realizar las operaciones: ${err}`
      };
    }
  }









   //-------------------------------------METODOS PARA EL LOGIN----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  /**
   * Metodo para identificar un usuario por medio de su correo y su clave generando un codigo 2fa
   * @param credenciales
   * @returns usuario
   */
  @post('/identificar-usuario-2fa')
  @response(200, {
    description: 'Identificar usuario por clave y correo',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async identificarUsuario(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credenciales),
        },
      },
    })
    credenciales: Credenciales,
  ): Promise<object> {
    let usuario = await this.seguridadService.identificarusuario(credenciales);
    if (usuario) {
      //generar codigo 2fa
      let codigo2fa = this.seguridadService.crearTextoAleatoria(5);
      let login: Login = new Login();
      login.usuarioid = usuario.id_usuario!;
      login.codigo_2fa = codigo2fa;
      login.estado_codigo2fa = false;
      login.token = '';
      login.estado_token = false;

      //reformatear la clave para no mostrarla
      usuario.clave = "";

      await this.loginRepository.create(login);
      //notificar al usuario via correo o sms del codigo 2fa

      return {
        "CODIGO": 200,
        "MENSAJE": "Operación exitosa",
        "DATOS": usuario
      };
    }
    return {
      "CODIGO": 2,
      "MENSAJE": "Operación fallida",
      "DATOS": "Usuario no encontrado"
    }
  }



    /**
   * Metodo para identificar un usuario por medio de su correo y su clave sin generar un codigo 2fa
   * @param credenciales
   * @returns usuario
   */
    @post('/identificar-usuario-SIN-2fa')
    @response(200, {
      description: 'Identificar usuario por clave y correo',
      content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
    })
    async identificarUsuarioSin2fa(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Credenciales),
          },
        },
      })
      credenciales: Credenciales,
    ): Promise<object> {
      let usuario = await this.seguridadService.identificarusuario(credenciales);
      if (usuario) {
        //generar codigo 2fa
        let codigo2fa = this.seguridadService.crearTextoAleatoria(5);
        //genera el login
        let login: Login = new Login();
        //genera token
        let token = this.seguridadService.CrearToken(usuario);
        //genera el menu de permisos la lista por rol
        let menu = await this.seguridadService.ConsultarPermisosDeMenuPorUsuario(usuario.rolid);
        //inicializa el login
        login.usuarioid = usuario.id_usuario!;
        login.codigo_2fa = codigo2fa;
        login.estado_codigo2fa = true;
        login.token = token;
        login.estado_token = true;

        //reformatear la clave para no mostrarla
        usuario.clave = "";

        await this.loginRepository.create(login);
        //notificar al usuario via correo o sms del codigo 2fa

        return {
          "CODIGO": 200,
          "MENSAJE": "Operación exitosa",
          "DATOS": {
            usuario,
            token,
            menu: menu
          }
        };
      }
      return {
        "CODIGO": 2,
        "MENSAJE": "Operación fallida",
        "DATOS": "Usuario no encontrado"
      }
    }





  /**
   *  Metodo para validar el hash de un correo
   * @param hash
   * @returns
   */
  @post('/validar-hash-correo-publico')
  @response(200, {
    description: 'Valida el hash de un correo',
    content: {
      'application/json': {
        schema: getModelSchemaRef(HashValidacionUsuario),
      },
    },
  })
  async validarhashCorreo(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HashValidacionUsuario),
        },
      },
    })
    hash: HashValidacionUsuario,
  ): Promise<object> {
    try {
      let usuario = await this.usuarioRepository.findOne({
        where: {
          hashvalidacion: hash.codigoHash,
          estadovalidacion: false,
        }
      });
      if (usuario) {
        let key = await this.usuarioRepository.updateById(usuario.id_usuario, {
          estadovalidacion: true,
        });
        //ENVIAR MENSAJE DE WHATSAPP DE CONFIRMACION

        return {
          "CODIGO": 200,
          "MENSAJE": "Operación exitosa",
          "DATOS": true
        };

      } else {
        return {
          "CODIGO": 2,
          "MENSAJE": "Operación fallida",
          "DATOS": false
        };
      }
    } catch (err) {
      throw {
        "CODIGO": 500,
        "MENSAJE": `Error al realizar las operaciones: ${err}`,
        "DATOS": `Error al realizar las operaciones: ${err}`
      };
    }
  }

  /**
   * Metodo para validar el codigo 2fa
   * @param login
   * @returns
   */
  @post('/verificar-2fa')
  @response(200, {
    description: 'validar un codigo de 2fa',
  })
  async VerificarCodigo2fa(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FactorDeAutenticacionPorCodigo),
        },
      },
    })
    credenciales: FactorDeAutenticacionPorCodigo,
  ): Promise<object> {
    let usuario = await this.seguridadService.validarCoddigo2fa(credenciales);
    if (usuario) {
      let token = this.seguridadService.CrearToken(usuario);
      //borrando la clave para no mostrarla
      usuario.clave = "";
      //actualizar el estado del codigo 2fa  a true
      try {
        this.usuarioRepository.logins(usuario.id_usuario).patch({
          estado_codigo2fa: true,
          token: token,
          estado_token: true,
        },
          {
            estado_codigo2fa: false,
            codigo_2fa: credenciales.codigo2fa,
          });

      } catch (err) {
        throw new HttpErrors[500](`Error al actualizar el estado del codigo 2fa: ${err}`);
      }


      return {
        "CODIGO": 200,
        "MENSAJE": "Operación exitosa",
        "DATOS": {usuario, token}
      };
    }
    return {
      "CODIGO": 2,
      "MENSAJE": "Operación fallida",
      "DATOS": "Usuario no encontrado"
    }
  }





  //METODO QUE ME INAVILITA EL TOKEN ES DECIR PONE ESTADO_TOKEN EN FALSE
  @post('/cerrar-sesion')
  @response(200, {
    description: 'logout',
  })
  async logout(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CerrarSesion),
        },
      },
    })
    CerrarSesion: CerrarSesion,
  ): Promise<object> {
    try {

      let key = await this.usuarioRepository.logins(CerrarSesion.id_usuario).patch({
        estado_token: false,
      },
        {
          estado_token: true,
          token: CerrarSesion.token,
        });

      if (key.count === 0) {
        return {
          "CODIGO": 2,
          "MENSAJE": "Operación fallida",
          "DATOS": "Token o usuario no encontrado"
        };
      }
      return {
        "CODIGO": 200,
        "MENSAJE": "Operación exitosa",
        "DATOS": "Token invalidado"
      };


    } catch (err) {
      throw new HttpErrors[500](`Error al actualizar el estado del token: ${err}`);
    }
  }


  //METODOS EXTRAS ----------------------------------------------------------------------------------------------------------------------------
    //METODO PARA GENERAR UN HASH DE 100 CARACTERES
    @post('/generar-hash-100')
    @response(200, {
      description: 'Generar un hash',
    })
    async generarHash(): Promise<object> {
      let hash = this.seguridadService.crearTextoAleatoria(100);
      return {hash};
    }

    //METODO PARA GENERAR UN HASH DE 10 CARACTERES
    @post('/generar-hash-10')
    @response(200, {
      description: 'Generar un hash',
    })
    async generarHash10(): Promise<object> {
      let hash = this.seguridadService.crearTextoAleatoria(10);
      return {hash};
    }

  //METODO QUE RECIBE UN TOKEN Y DEVUELVE EL NOMBRE DEL ROL
  @post('/consultar-rol')
  @response(200, {
    description: 'consultar rol por token',
  })
  async consultarRol(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TokenModel),
        },
      },
    })
    token: TokenModel,
  ): Promise<object> {
    let rol = await this.seguridadService.obtenerRolDesdeToken(token.token);
    if (rol) {
      let nombre_rol = await this.seguridadService.obtenerNombreRol(+rol);
      return {
        "CODIGO": 200,
        "MENSAJE": "Operación exitosa",
        "DATOS": {rol, nombre_rol}
      };
    }
    return {
      "CODIGO": 2,
      "MENSAJE": "Operación fallida",
      "DATOS": "Usuario no encontrado"
    }
  }












}
