import { Document, Model } from "mongoose";
import {
  FoodItemTemplate, FoodItemTemplateRepository,
  FoodItemUnit, FoodItemUnitRepository
} from "../../food/index";
import { Recipe, RecipeCategory, RecipeCategoryRepository, RecipeRepository} from "../../recipe/index";
import { SocoboUser, SocoboUserRepository } from "../../socobouser/index";
import { DbExtension } from "../interface/db-extension";

export class MongoDbExtension implements DbExtension {

  public fooditemTemplate: FoodItemTemplateRepository;
  public fooditemUnit: FoodItemUnitRepository;
  public socobouser: SocoboUserRepository;
  public recipe: RecipeRepository;
  public recipeCategories: RecipeCategoryRepository;

  constructor (
    private _fooditemTemplateModel: Model<Document & FoodItemTemplate>,
    private _fooditemUnitModel: Model<Document & FoodItemUnit>,
    private _socobouserModel: Model<Document & SocoboUser>,
    private _recipeModel: Model<Document & Recipe>,
    private _recipeCategoriesModel: Model<Document & RecipeCategory>
  ) {
    this.fooditemTemplate = new FoodItemTemplateRepository(_fooditemTemplateModel);
    this.fooditemUnit = new FoodItemUnitRepository(_fooditemUnitModel);
    this.socobouser = new SocoboUserRepository(_socobouserModel);
    this.recipe = new RecipeRepository(_recipeModel),
    this.recipeCategories = new RecipeCategoryRepository(_recipeCategoriesModel);
  }
}
