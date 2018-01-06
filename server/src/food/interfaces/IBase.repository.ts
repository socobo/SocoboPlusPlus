import { Types } from "mongoose";
import { ApiError } from "../../app/index";

export interface IBaseRepository <T> {
  transformFunction: (result: any) => T;
  getAll (): Promise<T[] | ApiError>;
  getById (id: Types.ObjectId): Promise<T | ApiError>;
  save (entity: T): Promise<Types.ObjectId | ApiError>;
  updateById (id: Types.ObjectId, updateValues: object): Promise<T | ApiError>;
  deleteById (id: Types.ObjectId): Promise<object | ApiError>;
}
