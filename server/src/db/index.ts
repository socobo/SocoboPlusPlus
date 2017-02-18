import { IConfig, IDatabase, IMain } from "pg-promise";
import * as pgPromise from "pg-promise";

import { Config, DbConfig } from "../config";
import { RecipeRepository } from "./repositories/recipe.repository";
import { UserRepository } from "./repositories/user.repository";

interface IExtensions {
    users: UserRepository;
    recipes: RecipeRepository;
}

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
const options: any = {

    // Extending the database protocol with our custom repositories:
    extend: (obj: IExtensions) => {
        // Do not use "require()"" here, because this event occurs for every task
        // and transaction being executed, which should be as fast as possible.
        obj.users = new UserRepository(obj);
        obj.recipes = new RecipeRepository(obj);
    }

};

// Choose the db configuration depending on the current environment
const dbConfig = getDbConfig();

// Loading and initializing pg-promise:
const pgp: IMain = pgPromise(options);

// Create the database instance with extensions:
const db = pgp(dbConfig) as IDatabase<IExtensions>&IExtensions;

// Load and initialize optional diagnostics:
// import diag = require("./diagnostics"");
// diag.init(options);

// If you ever need to change the default pool size, here"s an example:
// pgp.pg.defaults.poolSize = 20;

// Database object is all that"s needed.
// And if you even need access to the library"s root (pgp object),
// you can do it via db.$config.pgp
// See: http://vitaly-t.github.io/pg-promise/Database.html#.$config
export = db;
