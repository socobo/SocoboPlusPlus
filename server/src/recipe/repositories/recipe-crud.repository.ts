import { ErrorType } from './../../app/models/errors/error-type';
import { Document, Model } from "mongoose";
import * as winston from "winston";

import { DbError, ERRORS, ErrorUtils } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { CrudRepository } from "../index";

export class RecipeCrudRepository<T> implements CrudRepository<T> {

  constructor (private _model: Model<Document & T>, private _notFoundType: ErrorType) {  }

  private _handleNotFound = (foundItem: any, id: string, method: string) => {
    if (!foundItem) {
      throw new DbError(
        this._notFoundType.withArgs("ID", id))
        .addSource(RecipeCrudRepository.name)
        .addSourceMethod(method);
    }
  }

  public save = async (item: T): Promise<DbError | T> => {
    try {
      return await new this._model(item).save();
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeCrudRepository.name, "save(..)");
    }
  }

  public getById = async (id: string): Promise<T | DbError> => {
    try {
      const foundItem = await this._model.findById(id).lean() as T;
      this._handleNotFound(foundItem, id, "findById()");
      return foundItem;
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeCrudRepository.name, "getById(..)");
    }
  }

  public getAll = async (): Promise<T[] | DbError> => {
    try {
      const foundItems = await this._model.find();
      return foundItems;
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeCrudRepository.name, "getAll(..)");
    }
  }

  public update = async (id: string, item: T): Promise<T | DbError> => {
    try {
      const foundItems = await this._model
        .findByIdAndUpdate(id, item, { new: true });
      this._handleNotFound(foundItems, id, "update()");
      return foundItems;
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeCrudRepository.name, "update(..)");
    }
  }

  public delete = async (id: string): Promise<void | DbError> => {
    try {
      return await this._model.remove({_id: id});
    } catch (error) {
      winston.error(error);
      return ErrorUtils.handleDbError(error, RecipeCrudRepository.name, "delete(..)");
    }
  }
}
