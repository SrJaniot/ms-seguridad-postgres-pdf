import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Rol,
  Usuario,
} from '../models';
import {RolRepository} from '../repositories';

export class RolUsuarioController {
  constructor(
    @repository(RolRepository) protected rolRepository: RolRepository,
  ) { }

  @get('/rols/{id}/usuarios', {
    responses: {
      '200': {
        description: 'Array of Rol has many Usuario',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Usuario)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.rolRepository.usuarios(id).find(filter);
  }

  @post('/rols/{id}/usuarios', {
    responses: {
      '200': {
        description: 'Rol model instance',
        content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Rol.prototype.id_rol,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuarioInRol',
            exclude: ['id_usuario'],
            optional: ['rolid']
          }),
        },
      },
    }) usuario: Omit<Usuario, 'id_usuario'>,
  ): Promise<Usuario> {
    return this.rolRepository.usuarios(id).create(usuario);
  }

  @patch('/rols/{id}/usuarios', {
    responses: {
      '200': {
        description: 'Rol.Usuario PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Partial<Usuario>,
    @param.query.object('where', getWhereSchemaFor(Usuario)) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.rolRepository.usuarios(id).patch(usuario, where);
  }

  @del('/rols/{id}/usuarios', {
    responses: {
      '200': {
        description: 'Rol.Usuario DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Usuario)) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.rolRepository.usuarios(id).delete(where);
  }
}
