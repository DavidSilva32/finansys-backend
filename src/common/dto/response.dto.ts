export interface ApiResponse<T = any> {
    payload: T | null;
    message: string;
    status: number;
}