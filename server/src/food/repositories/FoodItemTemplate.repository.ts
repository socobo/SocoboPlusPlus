import { Document, Model, Types } from "mongoose";
import { DbError, ERRORS, ErrorUtils } from "../../app/index";
import { FoodItemTemplate } from "../index";

export class FoodItemTemplateRepository {

  constructor (private _fooditemTemplateModel: Model<Document & FoodItemTemplate>) {}

  public getAll = async (): Promise<FoodItemTemplate[] | DbError> => {
    try {
      const templates = await this._fooditemTemplateModel.find({});
      return templates.map(this._transformResult);
    } catch (error) {
      return ErrorUtils.handleDbError(error, FoodItemTemplateRepository.name, "getAll(..)");
    }
  }

  public getById = async (id: Types.ObjectId): Promise<FoodItemTemplate | DbError> => {
    try {
      const template = await this._fooditemTemplateModel.findOne({_id: id});
      return this._transformResult(template);
    } catch (error) {
      return ErrorUtils.handleDbNotFound(ERRORS.FOODITEMTEMPLTE_NOT_FOUND, error,
        FoodItemTemplateRepository.name, "getById(..)", "id", id.toString());
    }
  }

  public save = async (template: FoodItemTemplate): Promise<Types.ObjectId | DbError> => {
    try {
      const createdFooditemTemplate = await this._fooditemTemplateModel.create(template);
      return createdFooditemTemplate._id;
    } catch (error) {
      return ErrorUtils.handleDbError(error, FoodItemTemplateRepository.name, "save(..)");
    }
  }

  public updateById = async (id: Types.ObjectId, name: string): Promise<FoodItemTemplate | DbError> => {
    try {
      const updateValues = { name, lastModified: Date.now() };
      const updatedTemplate = await this._fooditemTemplateModel.findByIdAndUpdate({ _id: id},
                                                                              { $set: updateValues },
                                                                              { new: true });
      return this._transformResult(updatedTemplate);
    } catch (error) {
      return ErrorUtils.handleDbError(error, FoodItemTemplateRepository.name, "updateById(..)");
    }
  }

  public deleteById = async (id: Types.ObjectId): Promise<object | DbError> => {
    try {
      await this._fooditemTemplateModel.findByIdAndRemove({_id: id});
      return { id };
    } catch (error) {
      return ErrorUtils.handleDbError(error, FoodItemTemplateRepository.name, "deleteById(..)");
    }
  }

  private _transformResult = (result: Document & FoodItemTemplate): FoodItemTemplate => {
    if (!result) { throw new Error("FoodItemTemplate not found!"); }
    const tranformedResult: FoodItemTemplate = new FoodItemTemplate()
      .setId(new Types.ObjectId(result.id))
      .setName(result.name)
      .setCreated(result.created)
      .setLastModified(result.lastModified);
    return tranformedResult;
  }
}
