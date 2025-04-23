import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Login, LoginRelations, Usuario} from '../models';
import {UsuarioRepository} from './usuario.repository';

export class LoginRepository extends DefaultCrudRepository<
  Login,
  typeof Login.prototype.id_login,
  LoginRelations
> {

  public readonly usuario: BelongsToAccessor<Usuario, typeof Login.prototype.id_login>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>,
  ) {
    super(Login, dataSource);
    this.usuario = this.createBelongsToAccessorFor('usuario', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuario', this.usuario.inclusionResolver);
  }
}
