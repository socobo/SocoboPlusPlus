import { Document, Model } from "mongoose";
import * as winston from "winston";

import { DbError, ERRORS, ErrorUtils } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { Recipe, recipeSchema, RecipeStep } from "../index";

export class RecipeRepository {

  constructor (private _recipeModel: Model<Document & Recipe>) {  }

  private _handleNotFound = (foundItem: any, id: string, method: string) => {
    if (!foundItem) {
      throw new DbError(
        ERRORS.RECIPE_NOT_FOUND.withArgs("ID", id))
        .addSource(RecipeRepository.name)
        .addSourceMethod(method);
    }
  }

  public save = async (recipe: Recipe): Promise<Recipe | DbError> => {

    try {
      return await new this._recipeModel(recipe).save();
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeRepository.name, "save(..)");
    }
  }

  public getById = async (id: string): Promise<Recipe | DbError> => {
    try {
      const foundRecipe = await this._recipeModel.findById(id);
      this._handleNotFound(foundRecipe, id, "findById()");
      return foundRecipe;
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeRepository.name, "getById(..)");
    }
  }

  public getAll = async (): Promise<Recipe[] | DbError> => {
    try {
      const foundRecipes = await this._recipeModel.find();
      return foundRecipes;
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeRepository.name, "getAll(..)");
    }
  }

  public searchByField = async (fieldName: string, value: string): Promise<Recipe[] | DbError> => {
    try {
      const searchCritiria = { [fieldName]: new RegExp (value, "i") };
      const foundRecipes = await this._recipeModel.find(searchCritiria);
      return foundRecipes;
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeRepository.name, "searchByField(..)");
    }
  }

  public update = async (id: string, recipe: Recipe): Promise<Recipe | DbError> => {
    try {
      const foundRecipe = await this._recipeModel.findByIdAndUpdate(id, recipe);
      this._handleNotFound(foundRecipe, id, "update()");
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeRepository.name, "update(..)");
    }
  }

  public delete = async (id: string): Promise<void | DbError> => {
    try {
      return await this._recipeModel.remove({_id: id});
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeRepository.name, "delete(..)");
    }
  }
}
