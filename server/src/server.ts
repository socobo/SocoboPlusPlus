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
import {
  AuthHandler, RecipeHandler, ValidationHandler
} from "./handler/index";
// middleware
import {
  ApiValidator, AuthValidator
} from "./logic/middleware/index";
// services
import {
  AuthService, RecipeService, UserService
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

  private _authHandler: AuthHandler;
  private _recipeHandler: RecipeHandler;
  private _validationHandler: ValidationHandler;

  private _authValidator: AuthValidator;

  private _cryptoUtils: CryptoUtils;

  private _authService: AuthService;
  private _recipeService: RecipeService;
  private _userService: UserService;

  constructor () {
    this._create();
    this._config();
    this._middleware();
    this._utils();
    this._services();
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
        connectionString = process.env.DATABASE_URL_TEST || Config.DATABASE_URL_TEST;
        break;

      case "development":
        connectionString = process.env.DATABASE_URL_DEV || Config.DATABASE_URL_DEV;
        break;

      case "production":
        connectionString = process.env.DATABASE_URL || Config.DATABASE_URL;
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
   * MIDDLEWARE
   */
  private _middleware (): void {
    this._authValidator = new AuthValidator();
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
    // init user service
    this._userService = new UserService(this._db);
    // init recipe service
    this._recipeService = new RecipeService(this._db);
    // init auth service
    this._authService = new AuthService(this._userService, this._cryptoUtils);
  }

  /**
   * HANDLER
   */
  private _handler (): void {
    this._authHandler = new AuthHandler(this._authValidator);
    this._validationHandler = new ValidationHandler(new ApiValidator());
    this._recipeHandler = new RecipeHandler(this._recipeService, this._userService);
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
    this._app.use("/api/v1/recipes", this._recipeRoute());
    this._app.use("/api/v1/auth", this._authRoute());
    this._app.use("/api/v1/users", this._usersRoute());
    this._app.use("/api/v1/logs", this._logsRoute());
  }

  private _authRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return auth route
    return new AuthRoute(this._authService, router,
      this._authValidator).createRoutes();
  }

  private _usersRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return users route
    return new UsersRoute(this._userService, router,
      this._authValidator).createRoutes();
  }

  private _logsRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return logs route
    return new LogRoute(router, this._authValidator).createRoutes();
  }

  private _recipeRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return recipe route
    return new RecipeRoute(router, this._recipeHandler,
      this._validationHandler, this._authHandler).createRoutes();
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
