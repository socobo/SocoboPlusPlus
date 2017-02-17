// create pgp instance with the repositories here
// <reference path='../../typings/index.d.ts' />

// Bluebird is the best promise library available today, and is the one recommended here:
import {IMain, IDatabase, IConfig} from 'pg-promise';
import { DbConfig, Config } from "../config";

import { UserRepository } from "./repositories/user.repository";
//import products = require('./repos/products');

interface IExtensions {
    users: UserRepository
    //products: products.Repository
}

// pg-promise initialization options:
var options: any = {

    // Extending the database protocol with our custom repositories:
    extend: (obj: IExtensions) => {
        // Do not use 'require()' here, because this event occurs for every task
        // and transaction being executed, which should be as fast as possible.
        obj.users = new UserRepository(obj);
        //obj.products = new products.Repository(obj, pgp);
    }

};

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

// Loading and initializing pg-promise:
import * as pgPromise from 'pg-promise';
var pgp: IMain = pgPromise(options);

// Create the database instance with extensions:
var db = <IDatabase<IExtensions>&IExtensions>pgp(dbConfig);

// Load and initialize optional diagnostics:
//import diag = require('./diagnostics');
//diag.init(options);

// If you ever need to change the default pool size, here's an example:
// pgp.pg.defaults.poolSize = 20;

// Database object is all that's needed.
// And if you even need access to the library's root (pgp object),
// you can do it via db.$config.pgp
// See: http://vitaly-t.github.io/pg-promise/Database.html#.$config
export = db;