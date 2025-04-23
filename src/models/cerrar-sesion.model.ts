import {Model, model, property} from '@loopback/repository';

@model()
export class CerrarSesion extends Model {
  @property({
    type: 'string',
    required: true,
  })
  id_usuario: string;

  @property({
    type: 'string',
    required: true,
  })
  token: string;


  constructor(data?: Partial<CerrarSesion>) {
    super(data);
  }
}

export interface CarrarSesionRelations {
  // describe navigational properties here
}

export type CarrarSesionWithRelations = CerrarSesion & CarrarSesionRelations;
