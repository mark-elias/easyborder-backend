import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  username?: string;
}
