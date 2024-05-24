import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { SeedService } from 'src/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seedService = app.get(SeedService);
  await seedService.seed();
  await app.close();
}

bootstrap();