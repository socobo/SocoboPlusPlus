import { IDatabase, IMain, IOptions } from "pg-promise";
import * as pgPromise from "pg-promise";

import { Config } from "../config";
import { DbConfig, DbExtensions } from "./../models/index";
import { RecipeRepository, UserRepository } from "./repositories/index";

const getDbConfig = (): DbConfig => {
  let dbConfig: DbConfig;

  switch ((process.env.NODE_ENV || Config.NODE_ENV)) {
    case "test":
      dbConfig = process.env.DB_CONFIG_TEST || Config.DB_CONFIG_TEST;
      break;

    case "development":
      dbConfig = process.env.DB_CONFIG_DEV || Config.DB_CONFIG_DEV;
      break;

    case "production":
      dbConfig = process.env.DB_CONFIG || Config.DB_CONFIG;
      break;

    default:
      throw new Error("NODE_ENV is not known!");
  }

  return dbConfig;
};

// pg-promise initialization options:
const options: IOptions<DbExtensions> = {
  extend: (obj: DbExtensions) => {
    obj.users = new UserRepository(obj);
    obj.recipes = new RecipeRepository(obj);
  }
};

// Choose the db configuration depending on the current environment
const dbConfig = getDbConfig();

// Loading and initializing pg-promise:
const pgp: IMain = pgPromise(options);

// Create the database instance with extensions:
const db = pgp(dbConfig) as IDatabase<DbExtensions>&DbExtensions;

// export database object
export = db;
