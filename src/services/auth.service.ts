import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {MenuRolRepository, UsuarioRepository} from '../repositories';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(
    @repository(MenuRolRepository)
    private repositorioMenuRol : MenuRolRepository,
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,

  ) {}


  async VerificarPermisoDeUsuarioPorRol(idRol: number, idMenu: number, Accion: string): Promise<UserProfile | undefined>{
    let permiso = await this.repositorioMenuRol.findOne({
      where:{
        rolid:idRol,
        menuid:idMenu,
      }
    });
    let continuar: boolean = false;
    console.log(permiso);
    if(permiso){
      switch (Accion) {
        case "guardar":
          continuar=permiso.guardar;
          break;
        case "listar":
          continuar=permiso.listar;
          break;
        case "elminar":
          continuar=permiso.eliminar;
          break;
        case "editar":
          continuar=permiso.editar;
          break;
        case "buscar_id":
          continuar=permiso.buscar_id;
          break;



        default:
          throw new HttpErrors[401]("El usuario no tiene permiso para realizar esta accion por que no existe esa accion");
      }
      if(continuar){
        let perfil: UserProfile= Object.assign({
          permitido:"OK"
        });
        return perfil;
      }else{
        return undefined;
      }

    }else{
      throw new HttpErrors[401]("El usuario no tiene permiso para realizar esta accion");
    }
  }



  async obtenerPerfilUsuario(idUsuarioToken: string): Promise<UserProfile> {
    // Busca en la base de datos el usuario con el ID proporcionado
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id_usuario: idUsuarioToken,
      },
    });

    if (!usuario) {
      // Si no se encuentra el usuario, lanza un error
      throw new Error('Usuario no encontrado');
    }

    let perfil: UserProfile= Object.assign({
      permitido:"OK"
    });
    return perfil;


  }












}
