import { Document, Model, Types } from "mongoose";
import { ApiError, DbError, ERRORS, ErrorUtils } from "../../app/index";
import { SocoboUser, SocoboUserRepository } from "../../socobouser/index";
import { FoodItem, FoodItemTemplate, FoodItemTemplateRepository } from "../index";
import { BaseRepository } from "./Base.repository";

export class FoodItemRepository extends BaseRepository <FoodItem> {

  constructor (
    private _fooditemModel: Model<Document & FoodItem>,
    private _fooditemTemplateRepo: FoodItemTemplateRepository,
    private _socobouserRepo: SocoboUserRepository
  ) {
    super(_fooditemModel, FoodItemRepository.name);
    this.transformFunction = this._transformResult;
  }

  public getAllBySocoboUserId = async (userId: string): Promise<FoodItem[] | DbError> => {
    const entities = await this.getAll() as FoodItem[];
    return entities.filter((entry: FoodItem) => entry.socoboUserId.toHexString() === userId);
  }

  public getAllBySocoboUserIdResolved = async (userId: string,
                                               isDeepResolve: boolean): Promise<FoodItem[] | DbError> => {
    const entities = await this.getAll() as FoodItem[];
    const filteredEntities = entities.filter((entry: FoodItem) => entry.socoboUserId.toHexString() === userId);
    return Promise.all(filteredEntities.map(async (entity: FoodItem) => {
      return await this._resolveFor(isDeepResolve, entity);
    }));
  }

  public getAllResolved = async (isDeepResolve: boolean): Promise<FoodItem[]> => {
    const entities = await this.getAll() as FoodItem[];
    return Promise.all(entities.map(async (entity: FoodItem) => {
      return await this._resolveFor(isDeepResolve, entity);
    }));
  }

  public getByIdResolved = async (id: Types.ObjectId, isDeepResolve: boolean): Promise<FoodItem> => {
    const entity = await this.getById(id) as FoodItem;
    return await this._resolveFor(isDeepResolve, entity);
  }

  private _resolveFor = async (isDeepResolve: boolean, entity: FoodItem): Promise<FoodItem> => {
    const template = (isDeepResolve)
      ? await this._fooditemTemplateRepo.getByIdResolved(entity.foodItemTemplateId)
      : await this._fooditemTemplateRepo.getById(entity.foodItemTemplateId) as FoodItemTemplate;
    entity.foodItemTemplate = template;
    entity.foodItemTemplateId = undefined;

    const user = await this._socobouserRepo.getUserById(entity.socoboUserId.toHexString()) as SocoboUser;
    delete user.password;

    entity.socoboUser = user;
    entity.socoboUserId = undefined;

    return entity;
  }

  private _transformResult = (result: Document & FoodItem): FoodItem => {
    if (!result) {
      throw new ApiError(ERRORS.FOODITEM_NOT_FOUND.withArgs("id", "UNKNOWN"))
        .addSource(FoodItemRepository.name)
        .addSourceMethod("_transformResult(..)");
    }
    const transformedResult = new FoodItem()
      .setId(result.id)
      .setFoodItemTemplateId(result.foodItemTemplateId)
      .setSocoboUserId(result.socoboUserId)
      .setAmount(result.amount)
      .setBestBefore(result.bestBefore)
      .setCreated(result.created)
      .setLastModified(result.lastModified);
    return transformedResult;
  }
}
