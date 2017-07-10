export interface IBaseRepositiory<T> {
  transformFunction: any;
  getAll (): Promise<T[]>;
  getById (id: number): Promise<T>;
  save (entity: T): Promise<Object>;
  updateById (id: number, updateFieldValue: string): Promise<T>;
  deleteById (id: number): Promise<Object>;
}
