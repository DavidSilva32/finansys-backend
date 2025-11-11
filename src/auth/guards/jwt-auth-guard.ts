// src/auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { Request } from 'express';
import { UnauthorizedExceptionCustom } from 'src/common/exceptions/base.exception';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedExceptionCustom('Authorization header missing');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedExceptionCustom('Invalid authorization header format');
    }

    try {
      // Decodifica e valida o token
      const payload = this.jwtService.verify(token);
      
      // Busca o usuário no banco
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedExceptionCustom('User not found');
      }

      // Adiciona o usuário ao request para uso posterior
      request['user'] = user;

      return true;
    } catch (err) {
      throw new UnauthorizedExceptionCustom('Invalid or expired token');
    }
  }
}
