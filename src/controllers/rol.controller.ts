import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Rol} from '../models';
import {RolRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {ConfiguracionSeguridad} from '../config/seguridad.config';

export class RolController {
  constructor(
    @repository(RolRepository)
    public rolRepository : RolRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @post('/rol')
  @response(200, {
    description: 'Rol model instance',
    content: {'application/json': {schema: getModelSchemaRef(Rol)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {
            title: 'NewRol',
            exclude: ['id_rol'],
          }),
        },
      },
    })
    rol: Omit<Rol, 'id_rol'>,
  ): Promise<Rol> {
    return this.rolRepository.create(rol);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @get('/rol/count')
  @response(200, {
    description: 'Rol model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Rol) where?: Where<Rol>,
  ): Promise<Count> {
    return this.rolRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @get('/rol')
  @response(200, {
    description: 'Array of Rol model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Rol, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Rol) filter?: Filter<Rol>,
  ): Promise<Rol[]> {
    return this.rolRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @patch('/rol')
  @response(200, {
    description: 'Rol PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {partial: true}),
        },
      },
    })
    rol: Rol,
    @param.where(Rol) where?: Where<Rol>,
  ): Promise<Count> {
    return this.rolRepository.updateAll(rol, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @get('/rol/{id}')
  @response(200, {
    description: 'Rol model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Rol, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Rol, {exclude: 'where'}) filter?: FilterExcludingWhere<Rol>
  ): Promise<Rol> {
    return this.rolRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @patch('/rol/{id}')
  @response(204, {
    description: 'Rol PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {partial: true}),
        },
      },
    })
    rol: Rol,
  ): Promise<void> {
    await this.rolRepository.updateById(id, rol);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @put('/rol/{id}')
  @response(204, {
    description: 'Rol PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() rol: Rol,
  ): Promise<void> {
    await this.rolRepository.replaceById(id, rol);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @del('/rol/{id}')
  @response(204, {
    description: 'Rol DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.rolRepository.deleteById(id);
  }
}
