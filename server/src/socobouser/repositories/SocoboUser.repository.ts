import { Document, Model, Types } from "mongoose";
import { DbError, ERRORS, ErrorUtils } from "../../app/index";
import { SocoboUserUpdateType } from "../enums/SocoboUserUpdateType";
import { SocoboUser, SocoboUserProviderType, SocoboUserRoleType } from "../index";

export class SocoboUserRepository {

  constructor (private _socoboUserModel: Model<Document & SocoboUser>) {}

  public getAll = async (): Promise<SocoboUser[] | DbError> => {
    try {
      const users = await this._socoboUserModel.find({});
      return users.map(this._transformResult);
    } catch (error) {
      return ErrorUtils.handleDbError(error, SocoboUserRepository.name, "getAll(..)");
    }
  }

  public getUserById = async (id: Types.ObjectId): Promise<SocoboUser | DbError> => {
    try {
      const user = await this._socoboUserModel.findById(id);
      return this._transformResult(user);
    } catch (error) {
      return ErrorUtils.handleDbNotFound(ERRORS.USER_NOT_FOUND, error,
        SocoboUserRepository.name, "getUserById(..)", "id", id.toString());
    }
  }

  public getUserByEmail = async (email: string): Promise<SocoboUser | DbError> => {
    try {
      const user = await this._socoboUserModel.findOne({ email });
      return this._transformResult(user);
    } catch (error) {
      return ErrorUtils.handleDbNotFound (ERRORS.USER_NOT_FOUND, error,
        SocoboUserRepository.name, "getUserByEmail(..)", "email", email);
    }
  }

  public getUserByUsername = async (username: string): Promise<SocoboUser | DbError> => {
    try {
      const user = await this._socoboUserModel.findOne({ username });
      return this._transformResult(user);
    } catch (error) {
      return ErrorUtils.handleDbNotFound (ERRORS.USER_NOT_FOUND, error,
        SocoboUserRepository.name, "getUserByUsername(..)", "username", username);
    }
  }

  public save = async (user: SocoboUser): Promise<Types.ObjectId | DbError> => {
    try {
      const createdSocoboUser = await this._socoboUserModel.create(user);
      return new Types.ObjectId(createdSocoboUser._id);
    } catch (error) {
      return ErrorUtils.handleDbError(error, SocoboUserRepository.name, "save(..)");
    }
  }

  public updateById = async (id: Types.ObjectId, updateType: SocoboUserUpdateType,
                             fieldsToUpdate: object): Promise<SocoboUser | DbError> => {
    try {
      const checkedFieldsToUpdate = this._checkValidUpdateFields(updateType, fieldsToUpdate);
      const foundSocoboUser = await this._socoboUserModel.findById(id);
      const t = await this._socoboUserModel.update(checkedFieldsToUpdate, foundSocoboUser);
      return this._transformResult(foundSocoboUser);
    } catch (error) {
      return ErrorUtils.handleDbError(error, SocoboUserRepository.name, "updateById(..)");
    }
  }

  private _checkValidUpdateFields = (updateType: SocoboUserUpdateType, fieldsToUpdate: object): object => {
    const result: {[x: string]: any} = {};

    switch (updateType) {
      case SocoboUserUpdateType.full:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "username") { result.username = value; }
          if (key === "email") { result.email = value; }
          if (key === "password") { result.password = value; }
          if (key === "imageUrl") { result.imageUrl = value; }
          if (key === "role") { result.role = value; }
          if (key === "provider") { result.provider = value; }
        });
        result["lastModified"] = Date.now();
        break;

      case SocoboUserUpdateType.username:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "username") { result.username = value; }
        });
        result["lastModified"] = Date.now();
        break;

      case SocoboUserUpdateType.email:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "email") { result.email = value; }
        });
        result["lastModified"] = Date.now();
        break;

      case SocoboUserUpdateType.password:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "password") { result.password = value; }
        });
        result["lastModified"] = Date.now();
        break;

      case SocoboUserUpdateType.image:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "imageUrl") { result.imageUrl = value; }
        });
        result["lastModified"] = Date.now();
        break;

      case SocoboUserUpdateType.role:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "role") { result.role = value; }
        });
        result["lastModified"] = Date.now();
        break;

      case SocoboUserUpdateType.provider:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "provider") { result.provider = value; }
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
      const t = await this._socoboUserModel.remove({_id: id});
      return id;
    } catch (error) {
      return ErrorUtils.handleDbError(error, SocoboUserRepository.name, "deleteById(..)");
    }
  }

  private _transformResult = (result: Document & SocoboUser): SocoboUser => {
    const tranformedResult: SocoboUser = new SocoboUser()
      .setId(new Types.ObjectId(result.id))
      .setUsername(result.username)
      .setEmail(result.email)
      .setPassword(result.password)
      .setHasTermsAccepted(result.hasTermsAccepted)
      .setRole(result.role as SocoboUserRoleType)
      .setProvider(result.provider as SocoboUserProviderType)
      .setImageUrl(result.imageUrl)
      .setCreated(result.created)
      .setLastModified(result.lastModified);
    return tranformedResult;
  }
}
