import { NextFunction, Request, Response } from "express";
import {
  ApiError, ERRORS, SocoboRequest
} from "../../app/index";

import { DbExtension } from "../../db/interface/db-extension";
import { SocoboUser } from "../../socobouser/index";
import { Recipe } from "../index";

export class RecipeAuthorizationService {

  constructor (
    private _db: DbExtension
  ) {}

  private _requestCurrentUser = async (userFromToken: SocoboUser): Promise<SocoboUser> => {
    console.log('fetch user')

    let user: SocoboUser;
    try {
      console.log('mail', userFromToken.email)

      user = await this._db.socobouser.getUserByEmail(userFromToken.email) as SocoboUser;

    } catch (error) {

      const apiError = error as ApiError;
      if (apiError.statusCode === 404) {
        user = await this._db.socobouser.getUserByUsername(userFromToken.username) as SocoboUser;
      } else {
        throw error;
      }
    }
    return user;
  }

  private _throwAuthError = () => {
    console.log('throw error')
    throw new ApiError(ERRORS.REICPE_AUTHORIZATION)
      .addSource(RecipeAuthorizationService.name)
      .addSourceMethod("_throwAuthError()");
  }

  private _isEditable = (userId: string, recipe: Recipe): boolean =>
    (this._isOwner(userId, recipe) || recipe.collaborators.includes(userId))

  private _isReadable = (userId: string, recipe: Recipe): boolean =>
    (recipe.isPublic
      || this._isOwner(userId, recipe)
      || recipe.readers.includes(userId)
      || recipe.collaborators.includes(userId))

  private _isOwner = (userId: string, recipe: Recipe): boolean => (recipe.owner === userId);

  public owner = async (userFromToken: SocoboUser, recipe: Recipe) => {
    const user = await this._requestCurrentUser(userFromToken);
    return this._isOwner(user.id, recipe) || this._throwAuthError();
  }

  public readable = async (userFromToken: SocoboUser, recipe: Recipe) => {
    const user = await this._requestCurrentUser(userFromToken);
    return this._isReadable(user.id, recipe) || this._throwAuthError();
  }

  public editable = async (userFromToken: SocoboUser, recipe: Recipe) => {
    const user = await this._requestCurrentUser(userFromToken);
    console.log('editable', this._isEditable(user.id, recipe))
    this._throwAuthError();
    return this._isEditable(user.id, recipe);
  }

  public readableRecipes = async (userFromToken: SocoboUser, recipes: Recipe[]) => {
    const user = await this._requestCurrentUser(userFromToken);
    return recipes.filter((recipe) => this._isReadable(user.id, recipe));
  }

  public editableRecipes = async (userFromToken: SocoboUser, recipes: Recipe[]) => {
    const user = await this._requestCurrentUser(userFromToken);
    return recipes.filter((recipe) => this._isEditable(user.id, recipe));
  }

}
