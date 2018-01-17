import { Document, Model } from "mongoose";
import { ApiError, ERRORS, ErrorUtils } from "../../app/index";
import { SocoboUserUpdateType } from "../enums/SocoboUserUpdateType";
import { SocoboUser, SocoboUserProviderType, SocoboUserRoleType } from "../index";

export class SocoboUserRepository {

  constructor (private _socoboUserModel: Model<Document & SocoboUser>) {}

  public getAll = async (): Promise<SocoboUser[]> => {
    const users = await this._socoboUserModel.find({});
    return users.map(this._transformResult);
  }

  public getUserById = async (id: string): Promise<SocoboUser | ApiError> => {
    const user = await this._socoboUserModel.findOne({_id: id});
    return this._handleNotFound(user, "id", id)._transformResult(user);
  }

  public getUserByEmail = async (email: string): Promise<SocoboUser | ApiError> => {
    const user = await this._socoboUserModel.findOne({ email });
    return this._handleNotFound(user, "email", email)._transformResult(user);
  }

  public getUserByUsername = async (username: string): Promise<SocoboUser | ApiError> => {
    const user = await this._socoboUserModel.findOne({ username });
    return this._handleNotFound(user, "username", username)._transformResult(user);
  }

  public save = async (user: SocoboUser): Promise<string> => {
    const createdSocoboUser = await this._socoboUserModel.create(user);
    return createdSocoboUser._id;
  }

  public updateById = async (id: string, updateType: SocoboUserUpdateType,
                             fieldsToUpdate: object): Promise<SocoboUser | ApiError> => {
    const checkedFieldsToUpdate = this._checkValidUpdateFields(updateType, fieldsToUpdate);
    const updatedUser = await this._socoboUserModel.findByIdAndUpdate({ _id: id},
                                                                      { $set: checkedFieldsToUpdate },
                                                                      { new: true });
    return this._handleNotFound(updatedUser, "id", id)._transformResult(updatedUser);
  }

  public deleteById = async (id: string): Promise<object> => {
    await this._socoboUserModel.findByIdAndRemove({_id: id});
    return { id };
  }

  public deleteAll = async (): Promise<void> => {
    await this._socoboUserModel.remove({});
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
          if (key === "hasTermsAccepted") { result.hasTermsAccepted = value; }
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

      case SocoboUserUpdateType.terms:
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
          if (key === "hasTermsAccepted") { result.provider = value; }
        });
        result["lastModified"] = Date.now();
        break;

      default:
        throw new Error("Invalid UpdateType");
    }

    return result;
  }

  private _handleNotFound = (result: Document & SocoboUser, field: string, id: string) => {
    if (!result) { throw new ApiError(ERRORS.USER_NOT_FOUND.withArgs("identifier", id))
      .addSource(SocoboUserRepository.name)
      .addSourceMethod("_transformResult()");
    }
    return this;
  }

  private _transformResult = (result: Document & SocoboUser): SocoboUser => {
    const tranformedResult: SocoboUser = new SocoboUser()
      .setId(result.id)
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
