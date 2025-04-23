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
import {MenuRol} from '../models';
import {MenuRolRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {ConfiguracionSeguridad} from '../config/seguridad.config';

export class PermisosController {
  constructor(
    @repository(MenuRolRepository)
    public menuRolRepository : MenuRolRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @post('/permiso')
  @response(200, {
    description: 'MenuRol model instance',
    content: {'application/json': {schema: getModelSchemaRef(MenuRol)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MenuRol, {
            title: 'NewMenuRol',
            exclude: ['id_menu_rol'],
          }),
        },
      },
    })
    menuRol: Omit<MenuRol, 'id_menu_rol'>,
  ): Promise<MenuRol> {
    return this.menuRolRepository.create(menuRol);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @get('/permiso/count')
  @response(200, {
    description: 'MenuRol model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MenuRol) where?: Where<MenuRol>,
  ): Promise<Count> {
    return this.menuRolRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @get('/permiso')
  @response(200, {
    description: 'Array of MenuRol model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MenuRol, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MenuRol) filter?: Filter<MenuRol>,
  ): Promise<MenuRol[]> {
    return this.menuRolRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @patch('/permiso')
  @response(200, {
    description: 'MenuRol PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MenuRol, {partial: true}),
        },
      },
    })
    menuRol: MenuRol,
    @param.where(MenuRol) where?: Where<MenuRol>,
  ): Promise<Count> {
    return this.menuRolRepository.updateAll(menuRol, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @get('/permiso/{id}')
  @response(200, {
    description: 'MenuRol model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MenuRol, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MenuRol, {exclude: 'where'}) filter?: FilterExcludingWhere<MenuRol>
  ): Promise<MenuRol> {
    return this.menuRolRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @patch('/permiso/{id}')
  @response(204, {
    description: 'MenuRol PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MenuRol, {partial: true}),
        },
      },
    })
    menuRol: MenuRol,
  ): Promise<void> {
    await this.menuRolRepository.updateById(id, menuRol);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @put('/permiso/{id}')
  @response(204, {
    description: 'MenuRol PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() menuRol: MenuRol,
  ): Promise<void> {
    await this.menuRolRepository.replaceById(id, menuRol);
  }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @del('/permiso/{id}')
  @response(204, {
    description: 'MenuRol DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.menuRolRepository.deleteById(id);
  }
}
