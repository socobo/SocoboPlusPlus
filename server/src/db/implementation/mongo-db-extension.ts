import { Document, Model } from "mongoose";
import {
  FoodItem, FoodItemCategory,
  FoodItemCategoryRepository, FoodItemRepository,
  FoodItemTemplate, FoodItemTemplateRepository,
  FoodItemUnit, FoodItemUnitRepository
} from "../../food/index";
import { Recipe, RecipeCategory, RecipeCategoryRepository, RecipeRepository} from "../../recipe/index";
import { SocoboUser, SocoboUserRepository } from "../../socobouser/index";
import { DbExtension } from "../interface/db-extension";

export class MongoDbExtension implements DbExtension {

  public fooditemTemplate: FoodItemTemplateRepository;
  public fooditemCategory: FoodItemCategoryRepository;
  public fooditemUnit: FoodItemUnitRepository;
  public fooditem: FoodItemRepository;
  public socobouser: SocoboUserRepository;
  public recipe: RecipeRepository;
  public recipeCategory: RecipeCategoryRepository;

  constructor (
    private _fooditemTemplateModel: Model<Document & FoodItemTemplate>,
    private _fooditemCategoryModel: Model<Document & FoodItemCategory>,
    private _fooditemUnitModel: Model<Document & FoodItemUnit>,
    private _fooditemModel: Model<Document & FoodItem>,
    private _socobouserModel: Model<Document & SocoboUser>,
    private _recipeModel: Model<Document & Recipe>,
    private _recipeCategoryModel: Model<Document & RecipeCategory>
  ) {
    this.fooditemTemplate = new FoodItemTemplateRepository(_fooditemTemplateModel);
    this.fooditemCategory = new FoodItemCategoryRepository(_fooditemCategoryModel);
    this.fooditemUnit = new FoodItemUnitRepository(_fooditemUnitModel);
    this.fooditem = new FoodItemRepository(_fooditemModel);
    this.socobouser = new SocoboUserRepository(_socobouserModel);
    this.recipe = new RecipeRepository(_recipeModel),
    this.recipeCategory = new RecipeCategoryRepository(_recipeCategoryModel);
  }
}
