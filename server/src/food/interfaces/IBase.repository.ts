import { Types } from "mongoose";
import { DbError } from "../../app/index";

export interface IBaseRepository <T> {
  transformFunction: (result: any) => T;
  getAll (): Promise<T[] | DbError>;
  getById (id: Types.ObjectId): Promise<T | DbError>;
  save (entity: T): Promise<Types.ObjectId | DbError>;
  updateById (id: Types.ObjectId, name: string): Promise<T | DbError>;
  deleteById (id: Types.ObjectId): Promise<object | DbError>;
}
