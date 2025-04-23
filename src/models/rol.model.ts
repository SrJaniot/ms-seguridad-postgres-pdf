import {Entity, model, property, hasMany} from '@loopback/repository';
import {Usuario} from './usuario.model';
import {Menu} from './menu.model';
import {MenuRol} from './menu-rol.model';

@model()
export class Rol extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id_rol?: number;

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

  @hasMany(() => Usuario, {keyTo: 'rolid'})
  usuarios: Usuario[];

  @hasMany(() => Menu, {through: {model: () => MenuRol, keyFrom: 'rolid', keyTo: 'menuid'}})
  menus: Menu[];

  constructor(data?: Partial<Rol>) {
    super(data);
  }
}

export interface RolRelations {
  // describe navigational properties here
}

export type RolWithRelations = Rol & RolRelations;
