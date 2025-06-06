import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nest_api_users',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || true, // Set to false in production
}; 