import { Module } from '@nestjs/common';
// for database
import { MongooseModule } from '@nestjs/mongoose';
// for environment variables
import { ConfigService } from '@nestjs/config';
// for auth
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// strategies
import { JwtStrategy } from './strategies/jwt.strategy';
// user schema
import { UserSchema } from 'src/user/schemas/user.schema';
//

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRES'),
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [JwtStrategy],
  // so that other modules can use the JwtStrategy and PassportModule
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
