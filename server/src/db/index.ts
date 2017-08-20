import { connect } from "mongoose";
import { Config } from "../config";
import { MongoDbExtension } from "./implementation/mongo-db-extension";
import { SocoboUser } from "../socobouser/models/SocoboUser";

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

// Create MongoDB connection
connect(getConnectionUrl());

// Create Model classes
const socoboUserModel = new SocoboUser().getModelForClass(SocoboUser);

// Create DB Extension
const db = new MongoDbExtension(socoboUserModel);

// export database object
export = db;
