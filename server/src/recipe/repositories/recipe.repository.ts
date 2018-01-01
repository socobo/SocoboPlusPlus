import { Document, Model } from "mongoose";
import * as winston from "winston";
import { CrudRepository } from "./crud.repository";

import { DbError, ERRORS, ErrorUtils } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { Recipe, RecipeImage, recipeSchema, RecipeStep } from "../index";

export class RecipeRepository implements CrudRepository<Recipe> {

  constructor (
    private _recipeModel: Model<Document & Recipe>,
    private _crud: CrudRepository<Recipe>) {  }

  private _handleNotFound = (foundItem: any, id: string, method: string) => {
    if (!foundItem) {
      throw new DbError(
        ERRORS.RECIPE_NOT_FOUND.withArgs("ID", id))
        .addSource(RecipeRepository.name)
        .addSourceMethod(method);
    }
  }

  public save = async (recipe: Recipe): Promise<Recipe | DbError> => this._crud.save(recipe);

  public getById = async (id: string): Promise<Recipe | DbError> => {
    const foundRecipe = await this._crud.getById(id) as Recipe;
    if (!foundRecipe.images) {
      foundRecipe.images = [];
    }
    return foundRecipe;
  }

  public getImageById = async (recipeId: string, imageId: string): Promise<RecipeImage | DbError> => {
    try {
      const foundRecipe = await this.getById(recipeId) as Recipe;
      const image = foundRecipe.images
        .find((img: RecipeImage) => img._id.toString() === imageId);
      this._handleNotFound(image, imageId, "getImageById()");
      return image;
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeRepository.name, "getImageById(..)");
    }
  }

  public getAll = async (): Promise<Recipe[] | DbError> => this._crud.getAll();

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

  public update = async (id: string, recipe: Recipe): Promise<Recipe | DbError> =>
    this._crud.update(id, recipe)

  public removeImage = async (id: string, imgId: string): Promise<Recipe | DbError> => {
    try {
      const updatedRecipe = await this._recipeModel
        .findByIdAndUpdate(id, {$pull: {images: {_id: imgId}}}, { new: true });
      this._handleNotFound(updatedRecipe, id, "removeImage()");
      return updatedRecipe;
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeRepository.name, "removeImage(..)");
    }
  }

  public delete = async (id: string): Promise<void | DbError> => this._crud.delete(id);
}
