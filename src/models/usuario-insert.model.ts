import {Model, model, property} from '@loopback/repository';

@model()
export class UsuarioInsert extends Model {
  @property({
    type: 'string',
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


  constructor(data?: Partial<UsuarioInsert>) {
    super(data);
  }
}

export interface UsuarioInsertRelations {
  // describe navigational properties here
}

export type UsuarioInsertWithRelations = UsuarioInsert & UsuarioInsertRelations;
