export * from './user';
export interface PageParams {
  pageNum: number;
  pageSize: number;
}


export interface PageResult<T> {
  list: T[];
  total: number;
  pages: number;
}