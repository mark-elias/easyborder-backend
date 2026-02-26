import { Module } from '@nestjs/common';
// app
import { AppController } from './app.controller';
import { AppService } from './app.service';
// for environment variables
import { ConfigModule } from '@nestjs/config';
// for mongoDb
import { MongooseModule } from '@nestjs/mongoose';
// rate limiting
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
// modules
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CountryModule } from './country/country.module';
import { CrossingModule } from './crossing/crossing.module';
import { WaitTimeModule } from './wait-time/wait-time.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL || '', {
      onConnectionCreate: (connection) => {
        console.log('🌱 Database connected');
        return connection;
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute window
        limit: 100, // 100 requests per minute
      },
    ]),
    UserModule,
    AuthModule,
    CountryModule,
    CrossingModule,
    WaitTimeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
