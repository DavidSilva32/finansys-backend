import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { ApiResponse } from '../dto/response.dto';
import { BaseException } from '../exceptions/base.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private prismaErrorMap: Record<string, { status: number; message: string }> = {
    P2025: { status: 404, message: 'Register not found' },
    P2002: { status: 400, message: 'Unique constraint violation' },
  };

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof BaseException) {
      status = exception.statusCode;
      message = exception.message;
    }

    else if (exception instanceof HttpException) {
      const res: any = exception.getResponse();
      message =
        typeof res === 'object' && res.message
          ? res.message.toString()
          : exception.message;
      status = exception.getStatus();
    }

    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = this.prismaErrorMap[exception.code] ?? {
        status: 500,
        message: 'Database error',
      };
      status = prismaError.status;
      message = prismaError.message;
    }

    else if (exception instanceof Error) {
      message = exception.message || message;
    }

    const apiResponse: ApiResponse = {
      payload: null,
      message,
      status,
    };

    response.status(status).json(apiResponse);
  }
}
