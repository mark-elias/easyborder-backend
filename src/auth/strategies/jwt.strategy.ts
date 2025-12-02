import { Injectable, UnauthorizedException } from '@nestjs/common';
// for environment variables
import { ConfigService } from '@nestjs/config';
// for mongoose
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// for user schema
import { User } from 'src/user/schemas/user.schema';
// for auth
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private configService: ConfigService,
  ) {
    // 🚨 had to add this incase the secret is not set in the environment variables
    // const jwtSecret = process.env.JWT_SECRET;

    // get the jwt secret from the environment variables
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    super({
      // the function to extract the token from the request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // the secret key to verify the token
      secretOrKey: jwtSecret,
    });
  }

  // validate the token
  // 🚨 had to add the types to the payload to avoid type errors
  async validate(payload: { id: string; iat: number; exp: number }) {
    // get user id from payload (id is the user id from the token)
    const { id } = payload;
    // find the user in the database
    const user = await this.userModel.findById(id);
    // if user is not found, throw an error
    if (!user) {
      throw new UnauthorizedException('Invalid token or user not found');
    }
    // return the user
    return user;
  }
}
