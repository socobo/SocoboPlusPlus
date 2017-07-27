import { IDatabase, IMain, IOptions } from "pg-promise";
import * as pgPromise from "pg-promise";
import { DbExtensions } from "../app/index";
import { Config } from "../config";
import { RecipeRepository } from "../recipe/index";
import {
  SocoboUserImageRepository, SocoboUserProviderRepository, SocoboUserRepository, SocoboUserRoleRepository
} from "./../socobouser/index";

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

// pg-promise initialization options:
const options: IOptions<DbExtensions> = {
  extend: (obj: DbExtensions) => {
    obj.socobousers = new SocoboUserRepository(obj);
    obj.socobouserRoles = new SocoboUserRoleRepository(obj);
    obj.socobouserProviders = new SocoboUserProviderRepository(obj);
    obj.socobouserImages = new SocoboUserImageRepository(obj);
    obj.recipes = new RecipeRepository(obj);
  }
};

// Choose the db configuration depending on the current environment
const connectionUrl = getConnectionUrl();

// Loading and initializing pg-promise:
const pgp: IMain = pgPromise(options);

// Create the database instance with extensions:
const db = pgp(connectionUrl) as IDatabase<DbExtensions>&DbExtensions;

// export database object
export = db;
