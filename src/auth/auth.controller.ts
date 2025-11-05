import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BaseController } from 'src/common/controller/base.controller';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto.name, dto.email, dto.password);
    const safeUser = { id: user.id, email: user.email };
    const token = await this.authService.generateToken(safeUser);

    return this.createResponse(
      { user: { id: user.id, name: user.name, email: user.email }, token},
      'User registered successfully',
      201,
    );
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    const safeUser = { id: user.id, email: user.email };
    const token = await this.authService.generateToken(safeUser);

    return this.createResponse(
      {
        user: { id: user.id, name: user.name, email: user.email },
        token
      },
      'Login successful',
      200,
    );
  }
}
