import { ApiResponse } from '../dto/response.dto';

export class BaseController {
    protected createResponse<T>(payload: T | null, message = 'Success', status = 200): ApiResponse<T> {
        return { payload, message, status };
    }
}
