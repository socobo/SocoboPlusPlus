import { Document, Model } from "mongoose";
import * as winston from "winston";

import { DbError, ERRORS, ErrorUtils } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { Recipe, RecipeCategory, RecipeImage, recipeSchema, RecipeStep } from "../index";

export class RecipeCategoryRepository {

  constructor (private _recipeCategoriesModel: Model<Document & RecipeCategory>) {  }

  private _handleNotFound = (foundItem: any, id: string, method: string) => {
    if (!foundItem) {
      throw new DbError(
        ERRORS.RECIPE_CATEGORY_NOT_FOUND.withArgs("ID", id))
        .addSource(RecipeCategoryRepository.name)
        .addSourceMethod(method);
    }
  }

  public save = async (category: RecipeCategory): Promise<RecipeCategory | DbError> => {
    try {
      return await new this._recipeCategoriesModel(category).save();
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeCategoryRepository.name, "save(..)");
    }
  }

  public getById = async (id: string): Promise<RecipeCategory | DbError> => {
    try {
      const foundRecipeCategory = await this._recipeCategoriesModel.findById(id).lean() as RecipeCategory;
      this._handleNotFound(foundRecipeCategory, id, "findById()");
      return foundRecipeCategory;
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeCategoryRepository.name, "getById(..)");
    }
  }

  public getAll = async (): Promise<RecipeCategory[] | DbError> => {
    try {
      const foundRecipeCategories = await this._recipeCategoriesModel.find();
      return foundRecipeCategories;
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeCategoryRepository.name, "getAll(..)");
    }
  }

  public update = async (id: string, category: RecipeCategory): Promise<RecipeCategory | DbError> => {
    try {
      const foundRecipeCategories = await this._recipeCategoriesModel
        .findByIdAndUpdate(id, category, { new: true });
        console.log('found', foundRecipeCategories)

      this._handleNotFound(foundRecipeCategories, id, "update()");
      return foundRecipeCategories;
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeCategoryRepository.name, "update(..)");
    }
  }

  public delete = async (id: string): Promise<void | DbError> => {
    try {
      return await this._recipeCategoriesModel.remove({_id: id});
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeCategoryRepository.name, "delete(..)");
    }
  }
}
