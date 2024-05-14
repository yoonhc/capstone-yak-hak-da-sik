import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

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
