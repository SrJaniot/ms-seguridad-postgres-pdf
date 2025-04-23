import {Model, model, property} from '@loopback/repository';

@model()
export class UsuarioInsertActivacion extends Model {
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

  @property({
    type: 'boolean',
    required: true,
  })
  cuenta_activa: boolean;


  constructor(data?: Partial<UsuarioInsertActivacion>) {
    super(data);
  }
}

export interface UsuarioInsertActivacionRelations {
  // describe navigational properties here
}

export type UsuarioInsertActivacionWithRelations = UsuarioInsertActivacion & UsuarioInsertActivacionRelations;
