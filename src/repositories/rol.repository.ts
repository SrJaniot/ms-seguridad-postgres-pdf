import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Rol, RolRelations, Usuario, Menu, MenuRol} from '../models';
import {UsuarioRepository} from './usuario.repository';
import {MenuRolRepository} from './menu-rol.repository';
import {MenuRepository} from './menu.repository';

export class RolRepository extends DefaultCrudRepository<
  Rol,
  typeof Rol.prototype.id_rol,
  RolRelations
> {

  public readonly usuarios: HasManyRepositoryFactory<Usuario, typeof Rol.prototype.id_rol>;

  public readonly menus: HasManyThroughRepositoryFactory<Menu, typeof Menu.prototype.id_menu,
          MenuRol,
          typeof Rol.prototype.id_rol
        >;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('MenuRolRepository') protected menuRolRepositoryGetter: Getter<MenuRolRepository>, @repository.getter('MenuRepository') protected menuRepositoryGetter: Getter<MenuRepository>,
  ) {
    super(Rol, dataSource);
    this.menus = this.createHasManyThroughRepositoryFactoryFor('menus', menuRepositoryGetter, menuRolRepositoryGetter,);
    this.registerInclusionResolver('menus', this.menus.inclusionResolver);
    this.usuarios = this.createHasManyRepositoryFactoryFor('usuarios', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuarios', this.usuarios.inclusionResolver);
  }
}
