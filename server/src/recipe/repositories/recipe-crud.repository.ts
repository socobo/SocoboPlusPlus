import { Document, Model } from "mongoose";
import * as winston from "winston";
import { ErrorType } from "./../../app/models/errors/error-type";

import { ApiError, DbError, ERRORS, ErrorUtils } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { CrudRepository } from "../index";

export class RecipeCrudRepository<T> implements CrudRepository<T> {

  constructor (private _model: Model<Document & T>, private _notFoundType: ErrorType) {  }

  private _handleNotFound = (foundItem: any, id: string, method: string) => {
    if (!foundItem) {
      throw new ApiError(
        this._notFoundType.withArgs("ID", id))
        .addSource(RecipeCrudRepository.name)
        .addSourceMethod(method);
    }
  }

  public save = async (item: T): Promise<T> => await new this._model(item).save();

  public getById = async (id: string): Promise<T | ApiError> => {
    const foundItem = await this._model.findById(id).lean() as T;
    this._handleNotFound(foundItem, id, "findById()");
    return foundItem;
  }

  public getAll = async (): Promise<T[]> => await this._model.find();

  public update = async (id: string, item: T): Promise<T | ApiError> => {
    const foundItems = await this._model
      .findByIdAndUpdate(id, item, { new: true });
    this._handleNotFound(foundItems, id, "update()");
    return foundItems;
  }

  public delete = async (id: string): Promise<void> => await this._model.remove({_id: id});
}
