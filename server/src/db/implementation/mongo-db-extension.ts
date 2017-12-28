import { RecipeCrudRepository } from './../../recipe/repositories/recipe-crud.repository';
import { Document, Model } from "mongoose";
import {
  FoodItemCategory, FoodItemCategoryRepository,
  FoodItemTemplate, FoodItemTemplateRepository,
  FoodItemUnit, FoodItemUnitRepository
} from "../../food/index";
import {
  Recipe,
  RecipeCategory,
  RecipeCategoryRepository,
  RecipeIngredient,
  RecipeIngredientRepository,
  RecipeRepository} from "../../recipe/index";
import { SocoboUser, SocoboUserRepository } from "../../socobouser/index";
import { DbExtension } from "../interface/db-extension";

export class MongoDbExtension implements DbExtension {

  public fooditemTemplate: FoodItemTemplateRepository;
  public fooditemCategory: FoodItemCategoryRepository;
  public fooditemUnit: FoodItemUnitRepository;
  public socobouser: SocoboUserRepository;
  public recipe: RecipeRepository;
  public recipeCategory: RecipeCategoryRepository;
  public recipeIngredient: RecipeIngredientRepository;

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
    this.recipe = new RecipeRepository(_recipeModel),
    this.recipeCategory = new RecipeCategoryRepository(
      _recipeCategoryModel,
      new RecipeCrudRepository<RecipeCategory>(_recipeCategoryModel)),
    this.recipeIngredient = new RecipeIngredientRepository(_recipeIngredientModel);
  }
}
