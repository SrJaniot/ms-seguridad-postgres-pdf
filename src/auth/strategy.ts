// esta estrategia la saque de loopback 4  https://loopback.io/doc/en/lb4/Implement-your-own-strategy.html
// instalar npm i @loopback/authentication, npm i @loopback/security, npm i parse-bearer-token
// ojo registrar la estrategia en el archivo src/application.ts

import {AuthenticationBindings, AuthenticationMetadata, AuthenticationStrategy} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AuthService, SeguridadService} from '../services';
import {MenuRolRepository} from '../repositories';
import {repository} from '@loopback/repository';


export class AuthStrategy implements AuthenticationStrategy {
  //nombre de la estrategia
  name: string = 'auth';

  constructor(
    @service(SeguridadService)
    private servicioSeguridad: SeguridadService,
    @inject(AuthenticationBindings.METADATA)
    private metadata:AuthenticationMetadata[],
    @repository(MenuRolRepository)
    private repositorioMenuRol: MenuRolRepository,
    @service(AuthService)
    private servicioAuth: AuthService,

  ) {}

  /**
   * Autenticacion de un usuario frente a una accion en la base de datos
   * @param request la solicitud con el token
   * @returns el perfil de usuario, undefined cuando no tiene permiso o un httpError
   */

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token=parseBearerToken(request);
    if(token){
      let idRol= await this.servicioSeguridad.obtenerRolDesdeToken(token);
      let idMenu: string =this.metadata[0].options![0]; //MENU ADMINISTRAR USUARIO
      let Accion: string =this.metadata[0].options![1]; //ACCION LISTAR
      //console.log(this.metadata);
      try{
        // CONVERSIÓN DE STRING A NUMERO
        let id_rol = parseInt(idRol);
        let id_menu = parseInt(idMenu);
        // EN ESTA VARIABLE PERMISO LA API SABE QUE PERMISO PUEDE REALIZAR ESTE ROL
        let res = await this.servicioAuth.VerificarPermisoDeUsuarioPorRol(id_rol, id_menu, Accion);
        return res;
      }catch(error){
        throw error;
      }

    }
    throw new HttpErrors[401]("El usuario no tiene permiso para realizar esta accion por falta de token");
  }



}
