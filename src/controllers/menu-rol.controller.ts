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
Menu,
MenuRol,
Rol,
} from '../models';
import {MenuRepository} from '../repositories';

export class MenuRolController {
  constructor(
    @repository(MenuRepository) protected menuRepository: MenuRepository,
  ) { }

  @get('/menus/{id}/rols', {
    responses: {
      '200': {
        description: 'Array of Menu has many Rol through MenuRol',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Rol)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Rol>,
  ): Promise<Rol[]> {
    return this.menuRepository.rol(id).find(filter);
  }

  @post('/menus/{id}/rols', {
    responses: {
      '200': {
        description: 'create a Rol model instance',
        content: {'application/json': {schema: getModelSchemaRef(Rol)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Menu.prototype.id_menu,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {
            title: 'NewRolInMenu',
            exclude: ['id_rol'],
          }),
        },
      },
    }) rol: Omit<Rol, 'id_rol'>,
  ): Promise<Rol> {
    return this.menuRepository.rol(id).create(rol);
  }

  @patch('/menus/{id}/rols', {
    responses: {
      '200': {
        description: 'Menu.Rol PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {partial: true}),
        },
      },
    })
    rol: Partial<Rol>,
    @param.query.object('where', getWhereSchemaFor(Rol)) where?: Where<Rol>,
  ): Promise<Count> {
    return this.menuRepository.rol(id).patch(rol, where);
  }

  @del('/menus/{id}/rols', {
    responses: {
      '200': {
        description: 'Menu.Rol DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Rol)) where?: Where<Rol>,
  ): Promise<Count> {
    return this.menuRepository.rol(id).delete(where);
  }
}
