import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Menu, MenuRelations, Rol, MenuRol} from '../models';
import {MenuRolRepository} from './menu-rol.repository';
import {RolRepository} from './rol.repository';

export class MenuRepository extends DefaultCrudRepository<
  Menu,
  typeof Menu.prototype.id_menu,
  MenuRelations
> {

  public readonly rol: HasManyThroughRepositoryFactory<Rol, typeof Rol.prototype.id_rol,
          MenuRol,
          typeof Menu.prototype.id_menu
        >;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('MenuRolRepository') protected menuRolRepositoryGetter: Getter<MenuRolRepository>, @repository.getter('RolRepository') protected rolRepositoryGetter: Getter<RolRepository>,
  ) {
    super(Menu, dataSource);
    this.rol = this.createHasManyThroughRepositoryFactoryFor('rol', rolRepositoryGetter, menuRolRepositoryGetter,);
    this.registerInclusionResolver('rol', this.rol.inclusionResolver);
  }
}
