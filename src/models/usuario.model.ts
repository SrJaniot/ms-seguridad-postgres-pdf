import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Login} from './login.model';
import {Rol} from './rol.model';



// ACA SE AGREGA LA ESPECIFICACION DE LA RELACION ENTRE USUARIO Y ROL ES DECIR LLAVE FORANEA PARA LA TABLA ROL
// PARA HACER LAS MIGRACIONES PRIMERO TIENE QUE EXISTIR LOS ATRIBUTOS Y LAS RELACIONES CON "lb4 relation"
// LUEGO SE HACE LA MIGRACION CON "cd ..
// " siempre y cuando ya se haya configurado la base de datos
// npm run build
// npm run migrate
@model(
  {
    settings: {
      foreignKeys: {
        fk_rolid: {
          name: 'fk_rolid',  // Nombre de la llave foranea
          entity: 'Rol',   // Nombre de la entidad a la que se hace referencia
          entityKey: 'id_rol', // Nombre del atributo la llave primaria de la entidad a la que se hace referencia es decir el id del rol.model.ts
          foreignKey: 'rolid', // Nombre de  atributo de la entidad actual que hace referencia a la entidad a la que se hace referencia
        },  //NOTA : TENER EN CUENTA QUE POSTGRES TODOS LOS ATRIBUTOS LOS MANEJA EN MINUSCULAS ES DECIR QUE SI SE PONE UNA LETRA MAYUSCULA EN EL NOMBRE DE LA LLAVE FORANEA NO FUNCIONARA YA QUE NO RECONOCERA EL ATRIBUTO
      },
    },
  },
)
export class Usuario extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id_usuario: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'string',
    required: true,
  })
  celular: string;

  @property({
    type: 'string',
    required: true,
  })
  clave: string;

  @property({
    type: 'string',
  })
  hashvalidacion?: string;

  @property({
    type: 'boolean',
  })
  estadovalidacion?: boolean;

  @property({
    type: 'boolean',
  })
  aceptado?: boolean;

  @hasMany(() => Login, {keyTo: 'usuarioid'})
  logins: Login[];

  @belongsTo(() => Rol, {name: 'rol'})
  rolid: number;

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
