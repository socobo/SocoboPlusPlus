import { CrudRepository } from './crud.repository';
import { Document, Model } from "mongoose";
import * as winston from "winston";

import { DbError, ERRORS, ErrorUtils } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { Recipe, RecipeCategory, RecipeImage, recipeSchema, RecipeStep } from "../index";

export class RecipeCategoryRepository {

  constructor (
    private _recipeCategoriesModel: Model<Document & RecipeCategory>,
    private _crud: CrudRepository<RecipeCategory>) {  }

  private _handleNotFound = (foundItem: any, id: string, method: string) => {
    if (!foundItem) {
      throw new DbError(
        ERRORS.RECIPE_CATEGORY_NOT_FOUND.withArgs("ID", id))
        .addSource(RecipeCategoryRepository.name)
        .addSourceMethod(method);
    }
  }

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
