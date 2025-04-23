import {Entity, model, property, hasMany} from '@loopback/repository';
import {Rol} from './rol.model';
import {MenuRol} from './menu-rol.model';

@model()
export class Menu extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id_menu?: number;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  comentario: string;

  @hasMany(() => Rol, {through: {model: () => MenuRol, keyFrom: 'menuid', keyTo: 'rolid'}})
  rol: Rol[];

  constructor(data?: Partial<Menu>) {
    super(data);
  }
}

export interface MenuRelations {
  // describe navigational properties here
}

export type MenuWithRelations = Menu & MenuRelations;
