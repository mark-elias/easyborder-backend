import { Module } from '@nestjs/common';
// for mongoDB
import { MongooseModule } from '@nestjs/mongoose';
// user module
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
})
export class UserModule {}
