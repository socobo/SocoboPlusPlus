import "es6-shim";

import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import * as multer from "multer";
import * as path from "path";
import * as pgPromise from "pg-promise";
import * as uuid from "uuid";
import * as winston from "winston";
// server config
import { Config } from "./config";
// database setup
import * as db from "./db/index";
// handler
import { AuthValidationHandler, ModelValidationHandler } from "./logic/handler/index";
import {
  AuthHandler, LogHandler, RecipeHandler,
  SocoboUserHandler, SocoboUserImagesHandler, SocoboUserProvidersHandler, SocoboUserRolesHandler
} from "./logic/handler/index";
// middleware
import {
  AuthValidationMiddleware, ModelValidationMiddleware, RecipeMiddleware
} from "./logic/middleware/index";
// services
import {
  AuthService,
  FilesystemImageService,
  ImageService
} from "./logic/services/index";
// server utils
import {
  CryptoUtils
} from "./logic/utils/index";
// routes
import {
  AuthRoute, LogRoute, RecipeRoute,
  SocoboUserImagesRoute, SocoboUserProvidersRoute, SocoboUserRolesRoute, SocoboUsersRoute
} from "./routes/api/v1/index";

class Server {
  private _app: express.Application;
  private _port: number;
  private _server: http.Server;

  private _cryptoUtils: CryptoUtils;

  private _recipeUpload: multer.Instance;

  private _authService: AuthService;
  private _imgService: ImageService;

  private _authValidationMiddleware: AuthValidationMiddleware;
  private _modelValidationMiddleware: ModelValidationMiddleware;
  private _recipeMiddleware: RecipeMiddleware;

  private _authValidationHandler: AuthValidationHandler;
  private _modelValidationHandler: ModelValidationHandler;

  private _authHandler: AuthHandler;
  private _socoboUserHandler: SocoboUserHandler;
  private _socoboUserImagesHandler: SocoboUserImagesHandler;
  private _socoboUserProvidersHandler: SocoboUserProvidersHandler;
  private _socoboUserRolesHandler: SocoboUserRolesHandler;
  private _recipeHandler: RecipeHandler;
  private _logHandler: LogHandler;

  constructor () {
    this._create();
    this._config();
    this._utils();
    this._services();
    this._middleware();
    this._handler();
    this._uploader();
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
    this._imgService = new FilesystemImageService();
  }

  /**
   * MIDDLEWARE
   */
  private _middleware (): void {
    this._authValidationMiddleware = new AuthValidationMiddleware(db);
    this._modelValidationMiddleware = new ModelValidationMiddleware();
    this._recipeMiddleware = new RecipeMiddleware(db);
  }

  /**
   * HANDLER
   */
  private _handler (): void {
    this._authValidationHandler = new AuthValidationHandler(this._authValidationMiddleware);
    this._modelValidationHandler = new ModelValidationHandler(this._modelValidationMiddleware);
    this._authHandler = new AuthHandler(this._authService);
    this._socoboUserHandler = new SocoboUserHandler(db);
    this._socoboUserImagesHandler = new SocoboUserImagesHandler(db);
    this._socoboUserProvidersHandler = new SocoboUserProvidersHandler(db);
    this._socoboUserRolesHandler = new SocoboUserRolesHandler(db);
    this._recipeHandler = new RecipeHandler(db, this._recipeMiddleware, this._imgService);
    this._logHandler = new LogHandler();
  }

  /**
   * UPLOADS
   */
  private _uploader (): void {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `${process.cwd()}/${process.env.IMAGE_TMP_DIR || Config.IMAGE_TMP_DIR}`);
      },
      filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + uuid());
      }
    });
    this._recipeUpload = multer({storage});
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
    this._app.use("/api/v1/socobousers", this._socobousersRoute());
    this._app.use("/api/v1/sobouserimages", this._socobouserImagesRoute());
    this._app.use("/api/v1/sobouserproviders", this._socobouserProvidersRoute());
    this._app.use("/api/v1/sobouserroles", this._socobouserRolesRoute());
    this._app.use("/api/v1/recipes", this._recipeRoute());
    this._app.use("/api/v1/logs", this._logsRoute());
  }

  private _authRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return auth route
    return new AuthRoute(router, this._authHandler,
        this._authValidationHandler, this._modelValidationHandler).createRoutes();
  }

  private _socobousersRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return users route
    return new SocoboUsersRoute(router, this._socoboUserHandler, this._authValidationHandler).createRoutes();
  }

  private _socobouserImagesRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return users route
    return new SocoboUserImagesRoute(router, this._socoboUserImagesHandler,
        this._authValidationHandler).createRoutes();
  }

  private _socobouserProvidersRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return users route
    return new SocoboUserProvidersRoute(router, this._socoboUserProvidersHandler,
        this._authValidationHandler).createRoutes();
  }

  private _socobouserRolesRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return users route
    return new SocoboUserRolesRoute(router, this._socoboUserRolesHandler,
        this._authValidationHandler).createRoutes();
  }

  private _recipeRoute (): express.Router {
    // create new router
    const router: express.Router = express.Router();
    // init and return recipe route
    return new RecipeRoute(router, this._recipeUpload, this._recipeHandler,
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
