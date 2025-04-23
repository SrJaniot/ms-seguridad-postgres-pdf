import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {MenuRol, MenuRolRelations} from '../models';

export class MenuRolRepository extends DefaultCrudRepository<
  MenuRol,
  typeof MenuRol.prototype.id_menu_rol,
  MenuRolRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(MenuRol, dataSource);
  }
}
