import { Module } from '@nestjs/common';
// for mongoDB
import { MongooseModule } from '@nestjs/mongoose';
// user module
import { UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
  // so that other modules can use the User service
  exports: [UserService],
})
export class UserModule {}
