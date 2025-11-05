import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @Length(8, 72, { message: 'Password must be between 8 and 72 characters' })
  password: string;
}

class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @Length(8, 72)
  password: string;
}

export { RegisterDto, LoginDto };
