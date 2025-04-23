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
MenuRol,
Menu,
} from '../models';
import {RolRepository} from '../repositories';

export class RolMenuController {
  constructor(
    @repository(RolRepository) protected rolRepository: RolRepository,
  ) { }

  @get('/rols/{id}/menus', {
    responses: {
      '200': {
        description: 'Array of Rol has many Menu through MenuRol',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Menu)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Menu>,
  ): Promise<Menu[]> {
    return this.rolRepository.menus(id).find(filter);
  }

  @post('/rols/{id}/menus', {
    responses: {
      '200': {
        description: 'create a Menu model instance',
        content: {'application/json': {schema: getModelSchemaRef(Menu)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Rol.prototype.id_rol,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Menu, {
            title: 'NewMenuInRol',
            exclude: ['id_menu'],
          }),
        },
      },
    }) menu: Omit<Menu, 'id_menu'>,
  ): Promise<Menu> {
    return this.rolRepository.menus(id).create(menu);
  }

  @patch('/rols/{id}/menus', {
    responses: {
      '200': {
        description: 'Rol.Menu PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Menu, {partial: true}),
        },
      },
    })
    menu: Partial<Menu>,
    @param.query.object('where', getWhereSchemaFor(Menu)) where?: Where<Menu>,
  ): Promise<Count> {
    return this.rolRepository.menus(id).patch(menu, where);
  }

  @del('/rols/{id}/menus', {
    responses: {
      '200': {
        description: 'Rol.Menu DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Menu)) where?: Where<Menu>,
  ): Promise<Count> {
    return this.rolRepository.menus(id).delete(where);
  }
}
