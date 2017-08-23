import * as mongoose from "mongoose";
import { ApiError, ErrorType, ErrorUtils, LogService } from "../app/index";
import { Config } from "../config";
import { Recipe, recipeSchema } from "../recipe/index";
import { SocoboUser, socoboUserSchema } from "../socobouser/index";
import { MongoDbExtension } from "./implementation/mongo-db-extension";

// create Connectionstring
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

// Add Promise Lib
(mongoose as any).Promise = global.Promise;

// Create MongoDB connection
mongoose.connect(getConnectionUrl(), { useMongoClient: true }, (err) => {
  if (err) {
    return LogService.addError(err.message, ErrorUtils.handleError(err, "InitDatabase", "mongoose.connect(..)"));
  }
});

// Create Model classes
const socoboUserModel = mongoose.model<mongoose.Document & SocoboUser>("SocoboUser", socoboUserSchema, "socobousers");
const recipeModel = mongoose.model<mongoose.Document & Recipe> ("Recipe", recipeSchema, "recipes");

// Create DB Extension
const db = new MongoDbExtension(socoboUserModel, recipeModel);

// export database object
export = db;
