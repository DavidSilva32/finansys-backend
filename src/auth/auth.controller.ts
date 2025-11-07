import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BaseController } from 'src/common/controller/base.controller';
import { LoginDto, RefreshDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    const safeUser = { id: user.id, email: user.email };
    const tokens = await this.authService.generateTokens(safeUser);

    return this.createResponse(
      { user: { id: user.id, name: user.name, email: user.email }, tokens },
      'User registered successfully',
      201,
    );
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto);
    const safeUser = { id: user.id, email: user.email };
    const tokens = await this.authService.generateTokens(safeUser);

    return this.createResponse(
      {
        user: { id: user.id, name: user.name, email: user.email },
        tokens,
      },
      'Login successful',
      200,
    );
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    const tokens = await this.authService.refreshTokens(dto);
    return this.createResponse({ tokens }, 'Refresh tokens successful', 200);
  }
}
