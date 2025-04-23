import {Entity, model, property} from '@loopback/repository';

// CREACION DE LA ESPECIFICACION DE LA RELACION ENTRE MENU Y ROL ES DECIR LLAVE FORANEA PARA LA TABLA ROL
@model(
  {
    settings: {
      foreignKeys: {
        fk_rolid: {
          name: 'fk_rolid',
          entity: 'Rol',
          entityKey: 'id_rol',
          foreignKey: 'rolid',
        },
        fk_menuid: {
          name: 'fk_menuid',
          entity: 'Menu',
          entityKey: 'id_menu',
          foreignKey: 'menuid',
        },
      },
    },
  },
)
export class MenuRol extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id_menu_rol?: number;

  @property({
    type: 'boolean',
    required: true,
  })
  listar: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  guardar: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  eliminar: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  editar: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  buscar_id: boolean;

  @property({
    type: 'number',
  })
  rolid?: number;

  @property({
    type: 'number',
  })
  menuid?: number;

  constructor(data?: Partial<MenuRol>) {
    super(data);
  }
}

export interface MenuRolRelations {
  // describe navigational properties here
}

export type MenuRolWithRelations = MenuRol & MenuRolRelations;
