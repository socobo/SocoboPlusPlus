import * as mongoose from "mongoose";
import { Config } from "../config";
import { MongoDbExtension } from "./implementation/mongo-db-extension";
import { SocoboUser, SocoboUserSchema } from "../socobouser/index";
import { ApiError, ErrorType, LogService, ErrorUtils } from "../app/index";

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

// Add Promise Lin
(<any>mongoose).Promise = global.Promise;

// Create MongoDB connection
mongoose.connect(getConnectionUrl(), { useMongoClient: true }, (err) => {
  if (err)
    return LogService.addError(err.message, ErrorUtils.handleError(err, "InitDatabase", "mongoose.connect(..)"));
});

// Create Model classes
const socoboUserModel = mongoose.model<mongoose.Document & SocoboUser>("SocoboUser", SocoboUserSchema, "socobousers");

// Create DB Extension
const db = new MongoDbExtension(socoboUserModel);

// export database object
export = db;
