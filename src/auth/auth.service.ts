import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  BadRequestExceptionCustom,
  NotFoundExceptionCustom,
  ConflictExceptionCustom,
} from 'src/common/exceptions/base.exception';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new BadRequestExceptionCustom(
        'Name, email and password are required',
      );
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictExceptionCustom('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password)
      throw new NotFoundExceptionCustom('User not found');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new BadRequestExceptionCustom('Invalid credentials');

    return user;
  }

  async generateToken(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
