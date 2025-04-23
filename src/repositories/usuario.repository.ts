import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Usuario, UsuarioRelations, Login, Rol} from '../models';
import {LoginRepository} from './login.repository';
import {RolRepository} from './rol.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id_usuario,
  UsuarioRelations
> {

  public readonly logins: HasManyRepositoryFactory<Login, typeof Usuario.prototype.id_usuario>;

  public readonly rol: BelongsToAccessor<Rol, typeof Usuario.prototype.id_usuario>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('LoginRepository') protected loginRepositoryGetter: Getter<LoginRepository>, @repository.getter('RolRepository') protected rolRepositoryGetter: Getter<RolRepository>,
  ) {
    super(Usuario, dataSource);
    this.rol = this.createBelongsToAccessorFor('rol', rolRepositoryGetter,);
    this.registerInclusionResolver('rol', this.rol.inclusionResolver);
    this.logins = this.createHasManyRepositoryFactoryFor('logins', loginRepositoryGetter,);
    this.registerInclusionResolver('logins', this.logins.inclusionResolver);
  }
}
