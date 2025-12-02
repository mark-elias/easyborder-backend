import { Module } from '@nestjs/common';
// app
import { AppController } from './app.controller';
import { AppService } from './app.service';
// for environment variables
import { ConfigModule } from '@nestjs/config';
// for mongoDb
import { MongooseModule } from '@nestjs/mongoose';
// modules
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL || '', {
      onConnectionCreate: (connection) => {
        console.log('🌱 Database connected successfully');
        console.log(`📊 Database: ${connection.name}`);
        return connection;
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
