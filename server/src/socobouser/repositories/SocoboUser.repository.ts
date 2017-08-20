import { Document, Model, Types } from "mongoose";
import { DbError, ERRORS, ErrorUtils } from "../../app/index";
import { SocoboUserUpdateType } from "../enums/SocoboUserUpdateType";
import { SocoboUser } from "../models/SocoboUser";

export class SocoboUserRepository {

  constructor (private _socoboUserModel: Model<SocoboUser & Document>) {}

  public getAll = async (): Promise<SocoboUser[] | DbError> => {
    try {
      return await this._socoboUserModel.find({});
    } catch (error) {
      return ErrorUtils.handleDbError(error, SocoboUserRepository.name, "getAll(..)");
    }
  }

  public getUserById = async (id: Types.ObjectId): Promise<SocoboUser | DbError> => {
    try {
      return await this._socoboUserModel.findById(id);
    } catch (error) {
      return ErrorUtils.handleDbNotFound(ERRORS.USER_NOT_FOUND, error,
        SocoboUserRepository.name, "getUserById(..)", "id", id.toString());
    }
  }

  public getUserByEmail = async (email: string): Promise<SocoboUser | DbError> => {
    try {
      return await this._socoboUserModel.findOne({ email: email });
    } catch (error) {
      return ErrorUtils.handleDbNotFound (ERRORS.USER_NOT_FOUND, error,
        SocoboUserRepository.name, "getUserByEmail(..)", "email", email);
    }
  }

  public getUserByUsername = async (username: string): Promise<SocoboUser | DbError> => {
    try {
      return await this._socoboUserModel.findOne({ username: username });
    } catch (error) {
      return ErrorUtils.handleDbNotFound (ERRORS.USER_NOT_FOUND, error,
        SocoboUserRepository.name, "getUserByUsername(..)", "username", username);
    }
  }

  public save = async (user: SocoboUser): Promise<Types.ObjectId | DbError> => {
    try {
      const createdSocoboUser: SocoboUser = await this._socoboUserModel.create(user);
      return new Types.ObjectId(createdSocoboUser.id);
    } catch (error) {
      return ErrorUtils.handleDbError(error, SocoboUserRepository.name, "save(..)");
    }
  }

  public updateById = async (id: Types.ObjectId, updateType: SocoboUserUpdateType,
                             fieldsToUpdate: object): Promise<SocoboUser | DbError> => {
    try {
      const checkedFieldsToUpdate = this._checkValidUpdateFields(updateType, fieldsToUpdate);
      const foundSocoboUser: SocoboUser = await this._socoboUserModel.findById(id);
      const t = await this._socoboUserModel.update(checkedFieldsToUpdate, foundSocoboUser);
      return foundSocoboUser;
    } catch (error) {
      return ErrorUtils.handleDbError(error, SocoboUserRepository.name, "updateById(..)");
    }
  }

  private _checkValidUpdateFields = (updateType: SocoboUserUpdateType, fieldsToUpdate: object): object => {
    let result: {[x: string]: any} = {};

    switch (updateType) {
      case SocoboUserUpdateType.full:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "username") { result.username = value }
          if (key === "email") { result.email = value }
          if (key === "password") { result.password = value }
          if (key === "imageUrl") { result.imageUrl = value }
          if (key === "role") { result.role = value }
          if (key === "provider") { result.provider = value }
        });
        result["lastModified"] = Date.now();
        break;

      case SocoboUserUpdateType.username:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "username") { result.username = value }
        });
        result["lastModified"] = Date.now();
        break;

      case SocoboUserUpdateType.email:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "email") { result.email = value }
        });
        result["lastModified"] = Date.now();
        break;

      case SocoboUserUpdateType.password:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "password") { result.password = value }
        });
        result["lastModified"] = Date.now();
        break;

      case SocoboUserUpdateType.image:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "imageUrl") { result.imageUrl = value }
        });
        result["lastModified"] = Date.now();
        break;

      case SocoboUserUpdateType.role:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "role") { result.role = value }
        });
        result["lastModified"] = Date.now();
        break;

      case SocoboUserUpdateType.provider:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "provider") { result.provider = value }
        });
        result["lastModified"] = Date.now();
        break;

      default:
        throw new Error("Invalid UpdateType");
    }

    return result;
  }

  public deleteById = async (id: Types.ObjectId): Promise<Types.ObjectId | DbError> => {
    try {
      const t = await this._socoboUserModel.remove({_id: id})
      return id;
    } catch (error) {
      return ErrorUtils.handleDbError(error, SocoboUserRepository.name, "deleteById(..)");
    }
  }
}
