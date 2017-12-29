import { Document, Model, Types } from "mongoose";
import { DbError, ERRORS, ErrorUtils } from "../../app/index";
import { IBaseRepository } from "../interfaces/IBase.repository";

export class BaseRepository <T> implements IBaseRepository <T> {

  private _transformFunction: (result: any) => T;

  constructor (
    private _model: Model<Document & T>,
    private _className: string
  ) {}

  set transformFunction (func: (result: any) => T) {
    this._transformFunction = func;
  }

  public async getAll (): Promise<T[] | DbError> {
    try {
      const entities = await this._model.find({});
      return entities.map(this._transformFunction);
    } catch (error) {
      return ErrorUtils.handleDbError(error, `${BaseRepository.name}_${this._className}`, "getAll(..)");
    }
  }

  public async getById (id: Types.ObjectId): Promise<T | DbError> {
    try {
      const entity = await this._model.findOne({_id: id});
      return this._transformFunction(entity);
    } catch (error) {
      return ErrorUtils.handleDbNotFound(
        ERRORS.GENERIC_BASE_NOT_FOUND, error, `${BaseRepository.name}_${this._className}`,
        "getRoleById(..)", this._className, "id", id.toString());
    }
  }

  public async save (entity: T): Promise<Types.ObjectId | DbError> {
    try {
      const createdEntity = await this._model.create(entity);
      return createdEntity._id;
    } catch (error) {
      return ErrorUtils.handleDbError(error, `${BaseRepository.name}_${this._className}`, "save(..)");
    }
  }

  public async updateById (id: Types.ObjectId, updateValues: object): Promise<T | DbError> {
    try {
      const updatedEntity = await this._model.findByIdAndUpdate({ _id: id},
                                                                { $set: updateValues },
                                                                { new: true });
      return this._transformFunction(updatedEntity);
    } catch (error) {
      return ErrorUtils.handleDbError(error, `${BaseRepository.name}_${this._className}`, "updateById(..)");
    }
  }

  public async deleteById (id: Types.ObjectId): Promise<object | DbError> {
    try {
      await this._model.findByIdAndRemove({_id: id});
      return { id };
    } catch (error) {
      return ErrorUtils.handleDbError(error, `${BaseRepository.name}_${this._className}`, "deleteById(..)");
    }
  }
}
