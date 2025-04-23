import {Model, model, property} from '@loopback/repository';

@model()
export class TokenModel extends Model {
  @property({
    type: 'string',
    required: true,
  })
  token: string;


  constructor(data?: Partial<TokenModel>) {
    super(data);
  }
}

export interface TokenModelRelations {
  // describe navigational properties here
}

export type TokenModelWithRelations = TokenModel & TokenModelRelations;
