import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Usuario} from './usuario.model';

@model(
  {
    settings: {
      foreignKeys: {
        fk_usuarioid: {
          name: 'fk_usuarioid',
          entity: 'Usuario',
          entityKey: 'id_usuario',
          foreignKey: 'usuarioid',
        },
      },
    },
  },
)
export class Login extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id_login?: number;

  @property({
    type: 'string',
    required: true,
  })
  codigo_2fa: string;

  @property({
    type: 'boolean',
    required: true,
  })
  estado_codigo2fa: boolean;

  @property({
    type: 'string',
  })
  token?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  estado_token: boolean;

  @belongsTo(() => Usuario, {name: 'usuario'})
  usuarioid: string;

  constructor(data?: Partial<Login>) {
    super(data);
  }
}

export interface LoginRelations {
  // describe navigational properties here
}

export type LoginWithRelations = Login & LoginRelations;
