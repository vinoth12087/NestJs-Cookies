import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: 'http://localhost:3001' })
  app.use(cookieParser())
  await app.listen(8080, () => console.log('MongoDB connected and Server is running on 8080'));
}
bootstrap();
