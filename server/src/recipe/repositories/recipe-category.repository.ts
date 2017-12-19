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

  // public save = async (recipe: Recipe): Promise<Recipe | DbError> => {
  //   try {
  //     return await new this._recipeModel(recipe).save();
  //   } catch (error) {
  //     winston.error(error);
  //     return ErrorUtils.handleDbError(error, RecipeCategoryRepository.name, "save(..)");
  //   }
  // }

  public getById = async (id: string): Promise<Recipe | DbError> => {
    try {
      const foundRecipeCategory = await this._recipeCategoriesModel.findById(id).lean() as Recipe;
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

  // public searchByField = async (fieldName: string, value: string): Promise<Recipe[] | DbError> => {
  //   try {
  //     const searchCritiria = { [fieldName]: new RegExp (value, "i") };
  //     const foundRecipes = await this._recipeModel.find(searchCritiria);
  //     return foundRecipes;
  //   } catch (error) {
  //     winston.error(error);
  //     return ErrorUtils.handleDbError(error, RecipeCategoryRepository.name, "searchByField(..)");
  //   }
  // }

  // public update = async (id: string, recipe: Recipe): Promise<Recipe | DbError> => {
  //   try {
  //     const foundRecipe = await this._recipeModel
  //       .findByIdAndUpdate(id, recipe, { new: true });
  //     this._handleNotFound(foundRecipe, id, "update()");
  //     return foundRecipe;
  //   } catch (error) {
  //     winston.error(error);
  //     return ErrorUtils.handleDbError(error, RecipeCategoryRepository.name, "update(..)");
  //   }
  // }

  // public removeImage = async (id: string, imgId: string): Promise<Recipe | DbError> => {
  //   try {
  //     const updatedRecipe = await this._recipeModel
  //       .findByIdAndUpdate(id, {$pull: {images: {_id: imgId}}}, { new: true });
  //     this._handleNotFound(updatedRecipe, id, "removeImage()");
  //     return updatedRecipe;
  //   } catch (error) {
  //     winston.error(error);
  //     return ErrorUtils.handleDbError(error, RecipeCategoryRepository.name, "removeImage(..)");
  //   }
  // }

  // public delete = async (id: string): Promise<void | DbError> => {
  //   try {
  //     return await this._recipeModel.remove({_id: id});
  //   } catch (error) {
  //     winston.error(error);
  //     return ErrorUtils.handleDbError(error, RecipeCategoryRepository.name, "delete(..)");
  //   }
  // }
}
