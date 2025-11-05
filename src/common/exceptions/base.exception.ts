import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
    constructor(
        public readonly message: string,
        public readonly statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    ) {
        super({ message, statusCode }, statusCode);
    }
}

export class NotFoundExceptionCustom extends BaseException {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

export class BadRequestExceptionCustom extends BaseException {
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}

export class UnauthorizedExceptionCustom extends BaseException {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
    }
}

// User already exists
export class ConflictExceptionCustom extends BaseException {
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }   
}
