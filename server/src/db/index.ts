import * as mongoose from "mongoose";
import { Config } from "../config";
import { MongoDbExtension } from "./implementation/mongo-db-extension";
import { SocoboUserSchema, ISocoboUserModel } from "../socobouser/index";

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
mongoose.connect(getConnectionUrl(), { useMongoClient: true });

// Create Model classes
const socoboUserModel: mongoose.Model<ISocoboUserModel> = mongoose.model<ISocoboUserModel>("SocoboUser", SocoboUserSchema, "socobousers", true);

// Create DB Extension
const db = new MongoDbExtension(socoboUserModel);

// export database object
export = db;
