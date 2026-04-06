export * from './user';
export * from './foster';
export * from './shop';

export interface ApiResponse<T> {
  code: number;        
  data: T;             
  msg: string;         
}
export interface PageParams {
  pageNum: number;
  pageSize: number;
}


export interface PageResult<T> {
  list: T[];
  total: number;
  pages: number;
}