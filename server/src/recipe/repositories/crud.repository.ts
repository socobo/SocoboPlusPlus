import { DbError } from "../../app/index";
import { ApiError } from "../../app/models/errors/api-error";

export interface CrudRepository<T> {
  save (item: T): Promise<T>;
  getById (id: string): Promise<T | ApiError>;
  getAll (): Promise<T[]>;
  update (id: string, item: T): Promise<T | ApiError>;
  delete (id: string): Promise<void>;
}
