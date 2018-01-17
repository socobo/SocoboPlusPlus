import { Document, Model, Types } from "mongoose";
import { ApiError, DbError, ERRORS, ErrorUtils } from "../../app/index";
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

  public async getAll (): Promise<T[] | ApiError> {
    const entities = await this._model.find({});
    return entities.map(this._transformFunction);
  }

  public async getById (id: Types.ObjectId): Promise<T | ApiError> {
    const entity = await this._model.findOne({ _id: id });
    return this._transformFunction(entity);
  }

  public async save (entity: T): Promise<Types.ObjectId> {
    const createdEntity = await new this._model(entity).save();
    return createdEntity._id;
  }

  public async updateById (id: Types.ObjectId, updateValues: object): Promise<T | ApiError> {
    const updatedEntity = await this._model.findByIdAndUpdate({ _id: id},
                                                              { $set: updateValues },
                                                              { new: true });
    return this._transformFunction(updatedEntity);
  }

  public async deleteById (id: Types.ObjectId): Promise<object> {
    await this._model.findByIdAndRemove({ _id: id });
    return { id };
  }

  public async deleteAll (): Promise<void> {
    await this._model.remove({});
  }
}
