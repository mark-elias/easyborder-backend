import { Injectable, UnauthorizedException } from '@nestjs/common';
// for environment variables
import { ConfigService } from '@nestjs/config';
// prisma
import { PrismaService } from 'src/prisma/prisma.service';
// for auth
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // get the jwt secret from the environment variables
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    super({
      // extract jwt from cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          return (req?.cookies?.auth_token as string) || null;
        },
        // fallback to auth header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      // secret key to verify tooken
      secretOrKey: jwtSecret,
    });
  }

  // validate the token
  async validate(payload: { id: string; iat: number; exp: number }) {
    // get user id from payload (id is the user id from the token)
    // find the user in the database
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });
    // if user is not found, throw an error
    if (!user) {
      throw new UnauthorizedException('Invalid token or user not found');
    }
    // return the user (req.user)
    return user;
  }
}
