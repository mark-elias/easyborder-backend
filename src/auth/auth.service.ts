import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
// drizzle
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_DB } from 'src/db/drizzle.constants';
import * as schema from 'src/db/schema';
import { users } from 'src/db/schema';
// services
import { UserService } from 'src/user/user.service';
// dtos
import { CreateUserDto } from 'src/user/DTOs/create-user.dto';
import { LoginUserDto } from './DTOs/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE_DB) private db: PostgresJsDatabase<typeof schema>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<{ token: string }> {
    // get user data from createUserDto
    const { email, password, username } = createUserDto;

    try {
      // use user service to create user
      const user = await this.userService.create({
        email,
        password: await bcrypt.hash(password, 10),
        ...(username && { username }),
      });

      // generate token
      const token = this.jwtService.sign({ id: user.id });
      // return token
      return { token };
    } catch (error) {
      if ((error as Error).message.includes('already exists')) {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    // get user data from loginUserDto
    const { email, password } = loginUserDto;

    // find user by email, selecting only the fields we need
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
      columns: { id: true, email: true, password: true },
    });

    // if user does not exist, throw an error
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    // password verification
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    // if password is incorrect, throw an error
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    // generate token
    const token = this.jwtService.sign({ id: user.id });
    return { token };
  }
}
