export interface GenericResponse {
  success: boolean;
  message: string;
  statusCode: number;
}
export interface Meta {
  page: number;
  limit: number;
  itemCount?: number;
  pageCount?: number;
}
