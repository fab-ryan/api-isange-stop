import { config } from '@/config';
import { Logger } from '@/utils';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DBModule {
  constructor(private readonly configService: ConfigService) {
    this.connectToDatabase();
  }

  private connectToDatabase() {
    const DATABASENAME = this.configService.get('DB_DATABASE');
    const connect = () =>
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: configService.get('DB_SYNCHRONIZE'),
        }),
        inject: [ConfigService],
      });
    try {
      connect();
      Logger.logger.log(
        `Connected to ${DATABASENAME} database successfully 🌏🔥 `,
      );
    } catch (err) {
      const message = (err as Error).message;
      Logger.logger.error(
        `Failed to connect to ${DATABASENAME} database: ${message}`,
      );
    }
  }
}
