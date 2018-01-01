import { DbError } from "../../app/index";

export interface CrudRepository<T> {
  save (item: T): Promise<T | DbError>;
  getById (id: string): Promise<T | DbError>;
  getAll (): Promise<T[] | DbError>;
  update (id: string, item: T): Promise<T | DbError>;
  delete (id: string): Promise<void | DbError>;
}
