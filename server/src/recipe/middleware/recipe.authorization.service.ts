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

  private _requestCurrentUser = async (emailOrUserName: string): Promise<SocoboUser> => {
    let user: SocoboUser;
    try {
      user = await this._db.socobouser.getUserByEmail(emailOrUserName) as SocoboUser;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.statusCode === 404) {
        user = await this._db.socobouser.getUserByUsername(emailOrUserName) as SocoboUser;
      } else {
        throw error;
      }
    }
    return user;
  }

  private _throwAuthError = () => {
    throw new ApiError(ERRORS.REICPE_AUTHORIZATION)
      .addSource(RecipeAuthorizationService.name)
      .addSourceMethod("_throwAuthError()");
  }

  private _isEditable = (userId: string, recipe: Recipe): boolean =>
    (this._isOwner(userId, recipe) || recipe.collaborators.includes(userId))

  private _isReadable = (userId: string, recipe: Recipe): boolean =>
    (recipe.isPublic || this._isOwner(userId, recipe) || recipe.readers.includes(userId))

  private _isOwner = (userId: string, recipe: Recipe): boolean => (recipe.owner === userId);

  public owner = async (emailOrUserName: string, recipe: Recipe) => {
    const user = await this._requestCurrentUser(emailOrUserName);
    return this._isOwner(user.id, recipe) || this._throwAuthError();
  }

  public readable = async (emailOrUserName: string, recipe: Recipe) => {
    const user = await this._requestCurrentUser(emailOrUserName);
    return this._isReadable(user.id, recipe) || this._throwAuthError();
  }

  public editable = async (emailOrUserName: string, recipe: Recipe) => {
    const user = await this._requestCurrentUser(emailOrUserName);
    return this._isEditable(user.id, recipe) || this._throwAuthError();
  }

  public readableRecipes = async (userIdentifier: string, recipes: Recipe[]) => {
    const user = await this._requestCurrentUser(userIdentifier);
    return recipes.filter((recipe) => this.readable(user.id, recipe));
  }

  public editableRecipes = async (userIdentifier: string, recipes: Recipe[]) => {
    const user = await this._requestCurrentUser(userIdentifier);
    return recipes.filter((recipe) => this.editable(user.id, recipe));
  }

}
