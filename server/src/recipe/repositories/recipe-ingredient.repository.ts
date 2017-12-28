import { Document, Model } from "mongoose";
import * as winston from "winston";

import { DbError, ERRORS, ErrorUtils } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { Recipe, RecipeIngredient, RecipeImage, recipeSchema, RecipeStep } from "../index";

export class RecipeIngredientRepository {

  constructor (private _recipeCategoriesModel: Model<Document & RecipeIngredient>) {  }

  // private _handleNotFound = (foundItem: any, id: string, method: string) => {
  //   if (!foundItem) {
  //     throw new DbError(
  //       ERRORS.RECIPE_NOT_FOUND.withArgs("ID", id))
  //       .addSource(RecipeIngredientRepository.name)
  //       .addSourceMethod(method);
  //   }
  // }

  // public save = async (Ingredient: RecipeIngredient): Promise<RecipeIngredient | DbError> => {
  //   try {
  //     return await new this._recipeCategoriesModel(Ingredient).save();
  //   } catch (error) {
  //     winston.error(error);
  //     return ErrorUtils.handleDbError(error, RecipeIngredientRepository.name, "save(..)");
  //   }
  // }

  // public getById = async (id: string): Promise<RecipeIngredient | DbError> => {
  //   try {
  //     const foundRecipeIngredient = await this._recipeCategoriesModel.findById(id).lean() as RecipeIngredient;
  //     this._handleNotFound(foundRecipeIngredient, id, "findById()");
  //     return foundRecipeIngredient;
  //   } catch (error) {
  //     winston.error(error);
  //     return ErrorUtils.handleDbError(error, RecipeIngredientRepository.name, "getById(..)");
  //   }
  // }

  // public getAll = async (): Promise<RecipeIngredient[] | DbError> => {
  //   try {
  //     const foundRecipeCategories = await this._recipeCategoriesModel.find();
  //     return foundRecipeCategories;
  //   } catch (error) {
  //     winston.error(error);
  //     return ErrorUtils.handleDbError(error, RecipeIngredientRepository.name, "getAll(..)");
  //   }
  // }

  // public update = async (id: string, Ingredient: RecipeIngredient): Promise<RecipeIngredient | DbError> => {
  //   try {
  //     const foundRecipeCategories = await this._recipeCategoriesModel
  //       .findByIdAndUpdate(id, Ingredient, { new: true });
  //     this._handleNotFound(foundRecipeCategories, id, "update()");
  //     return foundRecipeCategories;
  //   } catch (error) {
  //     winston.error(error);
  //     return ErrorUtils.handleDbError(error, RecipeIngredientRepository.name, "update(..)");
  //   }
  // }

  // public delete = async (id: string): Promise<void | DbError> => {
  //   try {
  //     return await this._recipeCategoriesModel.remove({_id: id});
  //   } catch (error) {
  //     winston.error(error);
  //     return ErrorUtils.handleDbError(error, RecipeIngredientRepository.name, "delete(..)");
  //   }
  // }
}
