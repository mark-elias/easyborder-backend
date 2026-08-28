import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // create app instance
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // trust proxy nginx
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  // helmet security
  app.use(helmet());
  // cookie parser
  app.use(cookieParser());

  // APP CONFIGURATION =====
  // enable CORS for frontend connection
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // validation for requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // global prefix for all routes
  app.setGlobalPrefix('api');

  // START SERVER ========
  const port = process.env.PORT || 3001;
  await app.listen(port);

  // basic logging
  console.log(
    `server running... ENV: ${process.env.NODE_ENV}; PORT: ${port}; CORS(frontend): ${process.env.FRONTEND_URL}`,
  );
  console.log(`DB url: ${process.env.DATABASE_URL ? '✅' : '❌'}`);
}
bootstrap();
