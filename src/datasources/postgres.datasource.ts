import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {ConfiguracionSeguridad} from '../config/seguridad.config';

const config = {
  name: 'postgres',
  connector: 'postgresql',
  url: '',
  host: '127.0.0.1',
  port: 5432,
  user: ConfiguracionSeguridad.connection_user_postgres,
  password: ConfiguracionSeguridad.connection_password_postgres,
  database: ConfiguracionSeguridad.connection_database_postgres
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PostgresDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'postgres';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.postgres', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
