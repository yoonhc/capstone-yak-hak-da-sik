import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // enable Cors
  app.enableCors();

  // Use global pipes
  app.useGlobalPipes(new ValidationPipe());

  // Seed Service(처음 db에 원하는 낱알 식별정보db와 같은 원하는 데이터 넣어주는 서비스)
  // 나중에 command로 작동하게 설정하면 좋을듯
  const seedService = app.get(SeedService);
  await seedService.seed();

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle("약학다식")
    .setDescription("The 약학다식 Api documentation")
    .setVersion("1.0")
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const configService = app.get(ConfigService);

  await app.listen(configService.get<number>('port'));
}
bootstrap();
