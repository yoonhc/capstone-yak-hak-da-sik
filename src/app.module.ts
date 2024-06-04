import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedsModule } from './meds/meds.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
// import { typeOrmAsyncConfig } from 'db/data-source';
import { PillsModule } from './pills/pills.module';
import { SeedModule } from './seed/seed.module';
import { MedRefsModule } from './med-refs/med-refs.module';
import { DursModule } from './durs/durs.module';
import { GptsModule } from './gpts/gpts.module';
import { ScrapedMedsModule } from './scraped-meds/scraped-meds.module';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: ["dist/**/*.entity.js"],
      synchronize: false,
      migrations: ["dist/db/migrations/*.js"],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [configuration],
    }),
    MedsModule,
    PillsModule,
    SeedModule,
    MedRefsModule,
    DursModule,
    GptsModule,
    ScrapedMedsModule
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