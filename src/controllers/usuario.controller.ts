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
import {Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
import {service} from '@loopback/core';
import {SeguridadService} from '../services';
import {authenticate} from '@loopback/authentication';
import {ConfiguracionSeguridad} from '../config/seguridad.config';

export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository : UsuarioRepository,
    //inyeccion de servicio de seguridad
    @service(SeguridadService)
    public seguridadService: SeguridadService,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',

          }),
        },
      },
    })
    usuario: Usuario,
  ): Promise<object> {
    //Encriptar la clave
    usuario.clave = this.seguridadService.encriptartexto(usuario.clave);
    usuario.correo = usuario.correo.toLowerCase();
    //verificar si el correo ya existe
    let usuarioExiste = await this.usuarioRepository.findOne({where: {correo: usuario.correo}});
    if(usuarioExiste){
      return {
        "CODIGO": 500,
        "MENSAJE": "Operación exitosa",
        "DATOS": "El correo ya existe en la base de datos"
      };
    }
    //verificar si el id_usuario ya existe
    usuarioExiste = await this.usuarioRepository.findOne({where: {id_usuario: usuario.id_usuario}});
    if(usuarioExiste){
      return {
        "CODIGO": 500,
        "MENSAJE": "Operación exitosa",
        "DATOS": "El id_usuario (numero de documento) ya existe en la base de datos"
      };
    }
    const result= await this.usuarioRepository.create(usuario);
    //eliminar la clave encriptada
    result.clave = "";
    return {
      "CODIGO": 200,
      "MENSAJE": "Operación exitosa",
      "DATOS": {result}
    };
  }
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }
}
