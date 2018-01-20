import { Document, Model, Types } from "mongoose";
import { ApiError, DbError, ERRORS, ErrorUtils } from "../../app/index";
import {
  BaseRepository, FoodItemCategory, FoodItemCategoryRepository,
  FoodItemTemplate, FoodItemUnit, FoodItemUnitRepository
} from "../index";

export class FoodItemTemplateRepository extends BaseRepository <FoodItemTemplate> {

  constructor (
    private _fooditemTemplateModel: Model<Document & FoodItemTemplate>,
    private _fooditemCategoryRepo: FoodItemCategoryRepository,
    private _fooditemUnitRepo: FoodItemUnitRepository
  ) {
    super(_fooditemTemplateModel, FoodItemTemplateRepository.name);
    this.transformFunction = this._transformResult;
  }

  public getAllResolved = async (): Promise<FoodItemTemplate[]> => {
    const templates = await this.getAll() as FoodItemTemplate[];
    return await Promise.all(templates.map(async (template: FoodItemTemplate) => {
      return await this._resolveFor(template);
    }));
  }

  public getByIdResolved = async (id: Types.ObjectId): Promise<FoodItemTemplate> => {
    const result = await this.getById(id);
    return await this._resolveFor(result as FoodItemTemplate);
  }

  private _resolveFor = async (template: FoodItemTemplate): Promise<FoodItemTemplate> => {
    const categories = await this._getCategoriesFor(template);
    template.categories = categories;
    template.categoryIds = undefined;

    const unit = await this._fooditemUnitRepo.getById(template.unitId) as FoodItemUnit;
    template.unit = unit;
    template.unitId = undefined;

    return template;
  }
  private _getCategoriesFor = async (template: FoodItemTemplate): Promise<FoodItemCategory[]> => {
    const categories = await Promise.all(template.categoryIds.map(async (categoryId: Types.ObjectId) => {
      return await this._fooditemCategoryRepo.getById(categoryId);
    })) as FoodItemCategory[];
    return categories;
  }

  private _transformResult = (result: Document & FoodItemTemplate): FoodItemTemplate => {
    if (!result) {
      throw new ApiError(ERRORS.FOODITEMTEMPLTE_NOT_FOUND.withArgs("id", "UNKNOWN"))
        .addSource(FoodItemTemplateRepository.name)
        .addSourceMethod("_transformResult(..)");
    }
    const tranformedResult: FoodItemTemplate = new FoodItemTemplate()
      .setId(new Types.ObjectId(result.id))
      .setCategoryIds(result.categoryIds)
      .setUnitId(result.unitId)
      .setName(result.name)
      .setCreated(result.created)
      .setLastModified(result.lastModified);
    return tranformedResult;
  }
}
