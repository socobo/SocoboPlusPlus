import { CrudRepository } from './crud.repository';
import { Document, Model } from "mongoose";

import { DbError } from "../../app/index";
import { RecipeCategory, } from "../index";

export class RecipeCategoryRepository {

  constructor (
    private _recipeCategoriesModel: Model<Document & RecipeCategory>,
    private _crud: CrudRepository<RecipeCategory>) { }

  public save = async (category: RecipeCategory): Promise<RecipeCategory | DbError> =>
    this._crud.save(category);

  public getById = async (id: string): Promise<RecipeCategory | DbError> =>
    this._crud.getById(id);

  public getAll = async (): Promise<RecipeCategory[] | DbError> =>
    this._crud.getAll();

  public update = async (id: string, category: RecipeCategory): Promise<RecipeCategory | DbError> =>
    this._crud.update(id, category);

  public delete = async (id: string): Promise<void | DbError> =>
    this._crud.delete(id);
}
