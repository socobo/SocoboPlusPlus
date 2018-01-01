import { Document, Model } from "mongoose";
import { ERRORS } from "../../app/models/errors/errors";
import {
  FoodItemCategory, FoodItemCategoryRepository,
  FoodItemTemplate, FoodItemTemplateRepository,
  FoodItemUnit, FoodItemUnitRepository
} from "../../food/index";
import {
  CrudRepository,
  Recipe,
  RecipeCategory,
  RecipeCrudRepository,
  RecipeIngredient,
  RecipeRepository} from "../../recipe/index";
import { SocoboUser, SocoboUserRepository } from "../../socobouser/index";
import { DbExtension } from "../interface/db-extension";

export class MongoDbExtension implements DbExtension {

  public fooditemTemplate: FoodItemTemplateRepository;
  public fooditemCategory: FoodItemCategoryRepository;
  public fooditemUnit: FoodItemUnitRepository;
  public socobouser: SocoboUserRepository;
  public recipe: RecipeRepository;
  public recipeCategory: CrudRepository<RecipeCategory>;
  public recipeIngredient: CrudRepository<RecipeIngredient>;

  constructor (
    private _fooditemTemplateModel: Model<Document & FoodItemTemplate>,
    private _fooditemCategoryModel: Model<Document & FoodItemCategory>,
    private _fooditemUnitModel: Model<Document & FoodItemUnit>,
    private _socobouserModel: Model<Document & SocoboUser>,
    private _recipeModel: Model<Document & Recipe>,
    private _recipeCategoryModel: Model<Document & RecipeCategory>,
    private _recipeIngredientModel: Model<Document & RecipeIngredient>
  ) {
    this.fooditemTemplate = new FoodItemTemplateRepository(_fooditemTemplateModel);
    this.fooditemCategory = new FoodItemCategoryRepository(_fooditemCategoryModel);
    this.fooditemUnit = new FoodItemUnitRepository(_fooditemUnitModel);
    this.socobouser = new SocoboUserRepository(_socobouserModel);
    this.recipe = new RecipeRepository(
      _recipeModel,
      new RecipeCrudRepository(
      _recipeModel,
      ERRORS.RECIPE_CATEGORY_NOT_FOUND));
    this.recipeCategory = new RecipeCrudRepository(
      _recipeCategoryModel,
      ERRORS.RECIPE_CATEGORY_NOT_FOUND);
    this.recipeIngredient = new RecipeCrudRepository(
      _recipeIngredientModel,
      ERRORS.RECIPE_INGREDIENT_NOT_FOUND);
  }
}
