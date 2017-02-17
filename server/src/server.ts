import "es6-shim";

import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as pgPromise from "pg-promise";
import * as winston from "winston";
// server config
import { Config } from "./config";
// handler
import { AuthValidationHandler, ModelValidationHandler } from "./logic/handler/index";
import { AuthHandler, LogHandler, RecipeHandler, UserHandler } from "./logic/handler/index";
// middleware
import {
  AuthValidationMiddleware, ModelValidationMiddleware
} from "./logic/middleware/index";
// repositories db object
import * as db from './db/index';
// services
import {
  AuthService
} from "./logic/services/index";
// server utils
import {
  CryptoUtils
} from "./logic/utils/index";
// routes
import {
  AuthRoute, LogRoute, RecipeRoute, UsersRoute
} from "./routes/api/v1/index";

class Server {
  private _app: express.Application;
  private _db: pgPromise.IDatabase<any>;
  private _port: number;
  private _server: http.Server;

  private _cryptoUtils: CryptoUtils;

  private _authService: AuthService;

  private _authValidationMiddleware: AuthValidationMiddleware;
  private _modelValidationMiddleware: ModelValidationMiddleware;

  private _authValidationHandler: AuthValidationHandler;
  private _modelValidationHandler: ModelValidationHandler;

  private _authHandler: AuthHandler;
  private _userHandler: UserHandler;
  private _recipeHandler: RecipeHandler;
  private _logHandler: LogHandler;

  constructor () {
    this._create();
    this._config();
    this._utils();
    this._services();
    this._middleware();
    this._handler();
    this._routes();
    this._listen();
  }

  /**
   * PUBLIC API
   */
  public static bootstrap (): Server {
    return new Server();
  }

  public get app (): express.Application {
    return this._app;
  }

  /**
   * CREATION
   */
  private _create (): void {
    this._createApp();
    this._createServer();
  }

  private _createApp (): void {
    this._app = express();
  }

  private _createServer (): void {
    this._server = http.createServer(this._app);
  }

  /**
   * CONFIGURATION
   */
  private _config (): void {
    this._configLogging();
    this._configDatabase();
    this._configServer();
  }

  private _configLogging (): void {
    // check environment and setup winston
    switch ((process.env.NODE_ENV || Config.NODE_ENV)) {
      case "test":
        winston.configure({
          transports: [
            new (winston.transports.File)({
              filename: `${process.cwd()}/logs/server.test.log.json`
            }),
            new (winston.transports.Console)()
          ]
        });
        break;

      case "development":
        winston.configure({
          transports: [
            new (winston.transports.File)({
              filename: `${process.cwd()}/logs/server.dev.log.json`
            }),
            new (winston.transports.Console)()
          ]
        });
        break;

      case "production":
        winston.configure({
          transports: [
            new (winston.transports.File)({
              filename: `${process.cwd()}/logs/server.log.json`
            }),
            new (winston.transports.Console)()
          ]
        });
        break;

      default:
        throw new Error("NODE_ENV is not known!");
    }
  }

  private _configDatabase (): void {
    // init pgPromise
    const pgp: pgPromise.IMain = pgPromise();
    // declare connectionString
    let connectionString: string;
    // check environment and init connectionString
    switch ((process.env.NODE_ENV || Config.NODE_ENV)) {
      case "test":
        connectionString = process.env.DB_URL_TEST || Config.DB_URL_TEST;
        break;

      case "development":
        connectionString = process.env.DB_URL_DEV || Config.DB_URL_DEV;
        break;

      case "production":
        connectionString = process.env.DB_URL || Config.DB_URL;
        break;

      default:
        throw new Error("NODE_ENV is not known!");
    }
    // init db
    this._db = pgp(connectionString);
  }

  private _configServer (): void {
    this._port = process.env.PORT || Config.PORT;
    this._app.use(cors());
    this._app.use(bodyParser.urlencoded({ extended: true }));
    this._app.use(bodyParser.json());
  }

  /**
   * UTILS
   */
  private _utils (): void {
    this._cryptoUtils = new CryptoUtils();
  }

  /**
   * SERVICES
   */
  private _services (): void {
    this._authService = new AuthService(db, this._cryptoUtils);
  }

  /**
   * MIDDLEWARE
   */
  private _middleware (): void {
    this._authValidationMiddleware = new AuthValidationMiddleware(db);
    this._modelValidationMiddleware = new ModelValidationMiddleware();
  }

  /**
   * HANDLER
   */
  private _handler (): void {
    this._authValidationHandler = new AuthValidationHandler(this._authValidationMiddleware);
    this._modelValidationHandler = new ModelValidationHandler(this._modelValidationMiddleware);
    this._authHandler = new AuthHandler(this._authService);
    this._userHandler = new UserHandler(db);
    this._recipeHandler = new RecipeHandler(db);
    this._logHandler = new LogHandler();
  }

  /**
   * ROUTES
   */
  private _routes (): void {
    this._frontendRoutes();
    this._apiRoutes();
  }

  private _frontendRoutes (): void {
    // serve frontend from server/dist/public
    this._app.use(express.static(path.join(__dirname, "public")));
  }

  private _apiRoutes (): void {
    // set routes to paths
    this._app.use("/api/v1/auth", this._authRoute());
    this._app.use("/api/v1/users", this._usersRoute());
    this._app.use("/api/v1/recipes", this._recipeRoute());
    this._app.use("/api/v1/logs", this._logsRoute());
  }

  private _authRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return auth route
    return new AuthRoute(router, this._authHandler, this._authValidationHandler).createRoutes();
  }

  private _usersRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return users route
    return new UsersRoute(router, this._userHandler, this._authValidationHandler).createRoutes();
  }

  private _recipeRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return recipe route
    return new RecipeRoute(router, this._recipeHandler,
        this._authValidationHandler, this._modelValidationHandler).createRoutes();
  }

  private _logsRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return logs route
    return new LogRoute(router, this._logHandler, this._authValidationHandler).createRoutes();
  }

  private _listen (): void {
    this._server.listen(this._port, () => {
      winston.info(`Server started on PORT: ${this._port}`);
    });
  }
}

// creater server class
const server: Server = Server.bootstrap();
// export application
export default server.app;
