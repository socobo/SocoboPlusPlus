import * as mongoose from "mongoose";
import { ApiError, ErrorType, ErrorUtils, LogService } from "../app/index";
import { Config } from "../config";
import {
  FoodItem, foodItemSchema,
  FoodItemTemplate, foodItemTemplateSchema,
  FoodItemUnit, foodItemUnitSchema
} from "../food/index";
import { Recipe, recipeSchema } from "../recipe/index";
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

(mongoose as any).Promise = global.Promise;

mongoose.connect(getConnectionUrl(), { useMongoClient: true }, (err) => {
  if (err) {
    return LogService.addError(err.message, ErrorUtils.handleError(err, "InitDatabase", "mongoose.connect(..)"));
  }
});

const fooditemTemplateModel = mongoose.model<mongoose.Document & FoodItemTemplate>("FoodItemTemplate",
                                                                                   foodItemTemplateSchema,
                                                                                   "fooditemtemplate");
const fooditemUnitModel = mongoose.model<mongoose.Document & FoodItemUnit>("FoodItemUnit",
                                                                           foodItemUnitSchema,
                                                                           "fooditemunit");
const fooditemModel = mongoose.model<mongoose.Document & FoodItem>("FoodItem",
                                                                   foodItemSchema,
                                                                   "fooditem");
const socoboUserModel = mongoose.model<mongoose.Document & SocoboUser>("SocoboUser",
                                                                       socoboUserSchema,
                                                                       "socobouser");
const recipeModel = mongoose.model<mongoose.Document & Recipe>("Recipe",
                                                               recipeSchema,
                                                               "recipe");

const db = new MongoDbExtension(fooditemTemplateModel, fooditemUnitModel, socoboUserModel, recipeModel);
export = db;
