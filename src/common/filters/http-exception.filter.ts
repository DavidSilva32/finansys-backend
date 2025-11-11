import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dto/response.dto';
import { BaseException } from '../exceptions/base.exception';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private prismaErrorMap: Record<string, { status: number; message: string }> = {
    P2025: { status: 404, message: 'Register not found' },
    P2002: { status: 400, message: 'Single constraint violation' },
  };

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const defaultError = { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal server error' };

    const getPrismaError = (err: Prisma.PrismaClientKnownRequestError) =>
      this.prismaErrorMap[err.code] ?? { status: 500, message: 'Database error' };

    const exceptionMap: Record<string, () => { status: number; message: string }> = {
      BaseException: () => ({ status: (exception as BaseException).statusCode, message: (exception as BaseException).message }),
      HttpException: () => {
        const res: any = (exception as HttpException).getResponse();
        const message =
          typeof res === 'object' && res.message
            ? res.message.toString()
            : (exception as HttpException).message;
        return { status: (exception as HttpException).getStatus(), message };
      },
      PrismaClientKnownRequestError: () => getPrismaError(exception as Prisma.PrismaClientKnownRequestError),
    };

    const exceptionKey = exception?.constructor?.name ?? 'Unknown';
    const { status, message } = exceptionMap[exceptionKey] ? exceptionMap[exceptionKey]() : defaultError;
  
     const apiResponse: ApiResponse = {
      payload: null,
      message,
      status,
    };

    response.status(status).json(apiResponse);
  }
}