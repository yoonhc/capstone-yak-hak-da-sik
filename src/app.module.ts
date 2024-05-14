import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedsModule } from './meds/meds.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Med } from './meds/med.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'yakhakdasik',
      entities: [Med],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.developtment', '.env.production'],
      isGlobal: true,
      load: [configuration],
    }),
    MedsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource){
    console.log('dbName', dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('meds');
  }
}
