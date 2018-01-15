import { Document, Model } from "mongoose";
import * as winston from "winston";
import { CrudRepository } from "./crud.repository";

import { ApiError, DbError, ERRORS, ErrorUtils } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { Recipe, RecipeImage, recipeSchema, RecipeStep } from "../index";

export class RecipeRepository implements CrudRepository<Recipe> {

  constructor (
    private _recipeModel: Model<Document & Recipe>,
    private _crud: CrudRepository<Recipe>) {  }

  private _handleNotFound = (foundItem: any, id: string, method: string) => {
    if (!foundItem) {
      throw new ApiError(
        ERRORS.RECIPE_NOT_FOUND.withArgs("ID", id))
        .addSource(RecipeRepository.name)
        .addSourceMethod(method);
    }
  }

  public save = async (recipe: Recipe): Promise<Recipe> => this._crud.save(recipe);

  public getById = async (id: string): Promise<Recipe | ApiError> => {
    const foundRecipe = await this._crud.getById(id) as Recipe;
    if (!foundRecipe.images) {
      foundRecipe.images = [];
    }
    return foundRecipe;
  }

  public getImageById = async (recipeId: string, imageId: string): Promise<RecipeImage | ApiError> => {
    const foundRecipe = await this.getById(recipeId) as Recipe;
    const image = foundRecipe.images
      .find((img: RecipeImage) => img._id.toString() === imageId);
    this._handleNotFound(image, imageId, "getImageById()");
    return image;
  }

  public getAll = async (): Promise<Recipe[]> => this._crud.getAll();

  public searchByField = async (fieldName: string, value: string): Promise<Recipe[]> => {
    const searchCritiria = { [fieldName]: new RegExp (value, "i") };
    const foundRecipes = await this._recipeModel.find(searchCritiria);
    return foundRecipes;
  }

  public update = async (id: string, recipe: Recipe): Promise<Recipe | ApiError> => {
    if (!recipe.duration) {
      delete recipe.duration;
    }
    return this._crud.update(id, recipe);
  }

  public removeImage = async (id: string, imgId: string): Promise<Recipe> => {
      const updatedRecipe = await this._recipeModel
        .findByIdAndUpdate(id, {$pull: {images: {_id: imgId}}}, { new: true });
      this._handleNotFound(updatedRecipe, id, "removeImage()");
      return updatedRecipe;
  }

  public delete = async (id: string): Promise<void> => this._crud.delete(id);

  public deleteAll = async (): Promise<void> => this._crud.deleteAll();
}
