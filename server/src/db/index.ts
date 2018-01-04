import * as m from "mongoose";
import { ApiError, ErrorType, ErrorUtils, LogService } from "../app/index";
import { Config } from "../config";
import {
  FoodItem, FoodItemCategory,
  foodItemCategorySchema, foodItemSchema,
  FoodItemTemplate, foodItemTemplateSchema,
  FoodItemUnit, foodItemUnitSchema
} from "../food/index";
import {
  Recipe,
  RecipeCategory,
  recipeCategorySchema,
  RecipeIngredient,
  recipeIngredientSchema,
  recipeSchema } from "../recipe/index";
import { SocoboUser, socoboUserSchema } from "../socobouser/index";
import { MongoDbExtension } from "./implementation/mongo-db-extension";

const getConnectionUrl = (): string => {
  let connectionUrl: string;

  switch ((process.env["NODE_ENV"] || Config.NODE_ENV)) {
    case "test":
      connectionUrl = process.env["DB_URL_TEST"] || Config.DB_URL_TEST;
      break;

    case "development":
      connectionUrl = process.env["DB_URL_DEV"] || Config.DB_URL_DEV;
      break;

    case "production":
      connectionUrl = process.env["DB_URL"] || Config.DB_URL;
      break;

    default:
      throw new Error("NODE_ENV is not known!");
  }

  return connectionUrl;
};

(m as any).Promise = global.Promise;

m.connect(getConnectionUrl(), { useMongoClient: true }, (err) => {
  if (err) {
    return LogService.addError(err.message, ErrorUtils.handleError(err, "InitDatabase", "mongoose.connect(..)"));
  }
});

const fooditemTemplateModel = m.model<m.Document & FoodItemTemplate>("FoodItemTemplate",
                                                                    foodItemTemplateSchema,
                                                                    "fooditemtemplate");
const fooditemCategoryModel = m.model<m.Document & FoodItemCategory>("FoodItemCategory",
                                                                    foodItemCategorySchema,
                                                                    "fooditemcategory");
const fooditemUnitModel = m.model<m.Document & FoodItemUnit>("FoodItemUnit",
                                                            foodItemUnitSchema,
                                                            "fooditemunit");
const fooditemModel = m.model<m.Document & FoodItem>("FoodItem",
                                                    foodItemSchema,
                                                    "fooditem");
const socoboUserModel = m.model<m.Document & SocoboUser>("SocoboUser",
                                                        socoboUserSchema,
                                                        "socobouser");
const recipeModel = m.model<m.Document & Recipe>("Recipe",
                                                recipeSchema,
                                                "recipe");
const recipeCategoriesModel = m.model<m.Document & RecipeCategory>("RecipeCategory",
                                                               recipeCategorySchema,
                                                               "recipeCategory");
const recipeIngredientModel = m.model<m.Document & RecipeIngredient>("RecipeIngredient",
                                                               recipeIngredientSchema,
                                                               "recipeIngredient");

const db = new MongoDbExtension(
  fooditemTemplateModel,
  fooditemCategoryModel,
  fooditemUnitModel,
  socoboUserModel,
  recipeModel,
  recipeCategoriesModel,
  recipeIngredientModel);

export = db;
