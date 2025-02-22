
import { DataSourceOptions, DataSource } from "typeorm";

export const dataSourceOptions:DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: null, 
    database: 'blog-nestjs', 
    entities: ['dist/**/*.entity.js'],
    migrations:['dist/db/migrations/*.js'],
    migrationsTableName: 'migration_log',
    synchronize: false
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;