import { ApiResponse } from "../dto/api-response.dto";

export const successResponse = <T>(data: T, message = 'Success'): ApiResponse<T> => ({
  success: true,
  message,
  data,
});