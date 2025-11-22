import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // CREATE APP INSTANCE
  const app = await NestFactory.create(AppModule);

  // APP CONFIGURATION
  // enable CORS for frontend connection
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // global prefix for all routes
  app.setGlobalPrefix('api');

  // START SERVER
  const port = process.env.PORT || 3001;
  await app.listen(port);

  // basic logging
  console.log('🚀 Backend running on port:', port);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(
    `🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`,
  );
}
bootstrap();
