import { CrudRepository } from './crud.repository';
import { Document, Model } from "mongoose";

import { DbError } from "../../app/index";
import { RecipeIngredient } from "../index";

export class RecipeIngredientRepository {

  constructor (
    private _recipeIngredientModel: Model<Document & RecipeIngredient>,
    private _crud: CrudRepository<RecipeIngredient>) { }

  public save = async (category: RecipeIngredient): Promise<RecipeIngredient | DbError> =>
    this._crud.save(category);

  public getById = async (id: string): Promise<RecipeIngredient | DbError> =>
    this._crud.getById(id);

  public getAll = async (): Promise<RecipeIngredient[] | DbError> =>
    this._crud.getAll();

  public update = async (id: string, category: RecipeIngredient): Promise<RecipeIngredient | DbError> =>
    this._crud.update(id, category);

  public delete = async (id: string): Promise<void | DbError> =>
    this._crud.delete(id);
}
