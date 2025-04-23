// Uncomment these imports to begin using these cool features!

import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {PermisosRolMenu, PermisosRolMenu2} from '../models';
import {service} from '@loopback/core';
import {AuthService, SeguridadService} from '../services';
import {UserProfile} from '@loopback/security';

// import {inject} from '@loopback/core';


export class AuthController {
  constructor(
    @service(AuthService)
    private authService: AuthService,
    @service(SeguridadService)
    private seguridadService: SeguridadService,
  ) {}


  /**
   * METODO QUE ME PERMITE VALIDAR LOS PERMISOS DE UN USUARIO PARA LA LOGICA DE NEGOCIOS ENDPOINT
   * @param datos de tipo PermisosRolMenu
   */


  @post('/validar-permisos')
  @response(200, {
    description: 'validacion de permisos de usuario para la logica de negocios',
    content: {'application/json': {schema: getModelSchemaRef(PermisosRolMenu)}},
  })
  async ValidarPermisosDeUsuario(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PermisosRolMenu ),
        },
      },
    })
    datos: PermisosRolMenu,
  ): Promise<UserProfile | undefined>{
    let  idRol=await this.seguridadService.obtenerRolDesdeToken(datos.token);
    let idRol2=parseInt(idRol);
    console.log(idRol);
    return this.authService.VerificarPermisoDeUsuarioPorRol(idRol2,datos.idMenu,datos.accion);
  }


  @post('/validar-permisos-idrol')
  @response(200, {
    description: 'validacion de permisos de usuario para la logica de negocios',
    content: {'application/json': {schema: getModelSchemaRef(PermisosRolMenu2)}},
  })
  async ValidarPermisosDeUsuarioidrol(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PermisosRolMenu2 ),
        },
      },
    })
    datos: PermisosRolMenu2,
  ): Promise<UserProfile | undefined>{
    
    return this.authService.VerificarPermisoDeUsuarioPorRol(datos.idRol,datos.idMenu,datos.accion);
  }







}
