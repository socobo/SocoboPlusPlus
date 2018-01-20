import "es6-shim";

import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import * as multer from "multer";
import * as path from "path";
import * as uuid from "uuid";
import * as winston from "winston";
// app
import {
  ApiError, CryptoUtils, ERRORS, FilesystemImageService, ImageService,
  LogHandler, LogRoute, ModelValidationHandler, ModelValidationMiddleware
} from "./app/index";
// auth
import {
  AuthHandler, AuthRoute, AuthService, AuthValidationHandler, AuthValidationMiddleware
} from "./auth/index";
// server config
import { Config } from "./config";
// database setup
import * as db from "./db/index";
// fooditem
import {
  FoodItemCategoryHandler, FoodItemCategoryRoute,
  FoodItemHandler, FoodItemRoute,
  FoodItemTemplateHandler, FoodItemTemplateRoute,
  FoodItemUnitHandler, FoodItemUnitRoute
} from "./food/index";
// recipe
import {
  RecipeAuthorizationService,
  RecipeCategoryHandler,
  RecipeCategoryRoute,
  RecipeHandler,
  RecipeIngredient,
  RecipeIngredientHandler,
  RecipeIngredientRoute,
  RecipeMiddleware,
  RecipeRoute
} from "./recipe/index";
// socobouser
import {
  SocoboUserHandler, SocoboUserMiddleware, SocoboUsersRoute
} from "./socobouser/index";

class Server {
  private _app: express.Application;
  private _port: number;
  private _server: http.Server;

  private _cryptoUtils: CryptoUtils;

  private _recipeUpload: multer.Instance;
  private _socobouserImagesUpload: multer.Instance;

  private _authService: AuthService;
  private _imgService: ImageService;
  private _recipeAuthService: RecipeAuthorizationService;

  private _authValidationMiddleware: AuthValidationMiddleware;
  private _modelValidationMiddleware: ModelValidationMiddleware;
  private _socoboUserMiddleware: SocoboUserMiddleware;
  private _recipeMiddleware: RecipeMiddleware;

  private _authValidationHandler: AuthValidationHandler;
  private _modelValidationHandler: ModelValidationHandler;

  private _authHandler: AuthHandler;
  private _fooditemTemplateHandler: FoodItemTemplateHandler;
  private _fooditemCategoryHandler: FoodItemCategoryHandler;
  private _fooditemUnitHandler: FoodItemUnitHandler;
  private _fooditemHandler: FoodItemHandler;
  private _socoboUserHandler: SocoboUserHandler;
  private _recipeHandler: RecipeHandler;
  private _recipeCategoryHandler: RecipeCategoryHandler;
  private _recipeIngredientHandler: RecipeIngredientHandler;
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
    switch ((process.env["NODE_ENV"] || Config.NODE_ENV)) {
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
    this._port = Number(process.env["PORT"]) || Config.PORT;
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
    this._socoboUserMiddleware = new SocoboUserMiddleware();
    this._recipeMiddleware = new RecipeMiddleware();
  }

  /**
   * HANDLER
   */
  private _handler (): void {
    this._authValidationHandler = new AuthValidationHandler(this._authValidationMiddleware);
    this._modelValidationHandler = new ModelValidationHandler(this._modelValidationMiddleware);
    this._authHandler = new AuthHandler(this._authService);
    this._fooditemTemplateHandler = new FoodItemTemplateHandler(db);
    this._fooditemCategoryHandler = new FoodItemCategoryHandler(db);
    this._fooditemUnitHandler = new FoodItemUnitHandler(db);
    this._fooditemHandler = new FoodItemHandler(db);
    this._socoboUserHandler = new SocoboUserHandler(db, this._imgService);
    this._recipeAuthService = new RecipeAuthorizationService(db);
    this._recipeHandler = new RecipeHandler(db, this._imgService, this._recipeAuthService);
    this._recipeCategoryHandler = new RecipeCategoryHandler(db);
    this._recipeIngredientHandler = new RecipeIngredientHandler(db);
    this._logHandler = new LogHandler();
  }

  /**
   * UPLOADS
   */
  private _uploader (): void {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `${process.cwd()}/${process.env["IMAGE_TMP_DIR"] || Config.IMAGE_TMP_DIR}`);
      },
      filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + uuid() + "_" + file.originalname);
      }
    });
    this._recipeUpload = multer({storage});
    this._socobouserImagesUpload = multer({storage});
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
    this._app.use("/api/v1/auth", this._authRoute());
    this._app.use("/api/v1/fooditemtemplate", this._fooditemTemplateRoute());
    this._app.use("/api/v1/fooditemcategory", this._fooditemCategoryRoute());
    this._app.use("/api/v1/fooditemunit", this._fooditemUnitRoute());
    this._app.use("/api/v1/fooditem", this._fooditemRoute());
    this._app.use("/api/v1/socobouser", this._socobouserRoute());
    this._app.use("/api/v1/recipe", this._recipeRoute());
    this._app.use("/api/v1/recipecategory", this._recipeCategoryRoute());
    this._app.use("/api/v1/recipeingredient", this._recipeIngredientRoute());
    this._app.use("/api/v1/log", this._logRoute());
    this._app.use(this._handleGenericErrors);
  }

  private _authRoute (): express.Router {
    const router: express.Router = express.Router();
    return new AuthRoute(router, this._authHandler,
      this._authValidationHandler, this._modelValidationHandler).createRoutes();
  }

  private _fooditemTemplateRoute (): express.Router {
    const router: express.Router = express.Router();
    return new FoodItemTemplateRoute(router, this._fooditemTemplateHandler,
      this._authValidationHandler, this._modelValidationHandler).createRoutes();
  }

  private _fooditemCategoryRoute (): express.Router {
    const router: express.Router = express.Router();
    return new FoodItemCategoryRoute(router, this._fooditemCategoryHandler,
      this._authValidationHandler, this._modelValidationHandler).createRoutes();
  }

  private _fooditemUnitRoute (): express.Router {
    const router: express.Router = express.Router();
    return new FoodItemUnitRoute(router, this._fooditemUnitHandler,
      this._authValidationHandler, this._modelValidationHandler).createRoutes();
  }

  private _fooditemRoute (): express.Router {
    const router: express.Router = express.Router();
    return new FoodItemRoute(router, this._fooditemHandler,
      this._authValidationHandler, this._modelValidationHandler).createRoutes();
  }

  private _socobouserRoute (): express.Router {
    const router: express.Router = express.Router();
    return new SocoboUsersRoute(router, this._socoboUserHandler,
      this._authValidationHandler, this._modelValidationHandler,
      this._socobouserImagesUpload, this._socoboUserMiddleware).createRoutes();
  }

  private _recipeRoute (): express.Router {
    const router: express.Router = express.Router();
    return new RecipeRoute(router, this._recipeUpload, this._recipeHandler,
      this._authValidationHandler, this._modelValidationHandler,
      this._recipeMiddleware).createRoutes();
  }

  private _recipeCategoryRoute (): express.Router {
    const router: express.Router = express.Router();
    return new RecipeCategoryRoute(router, this._recipeCategoryHandler,
      this._authValidationHandler, this._modelValidationHandler).createRoutes();
  }

  private _recipeIngredientRoute (): express.Router {
    const router: express.Router = express.Router();
    return new RecipeIngredientRoute(
      router,
      this._recipeIngredientHandler,
      this._authValidationHandler,
      this._modelValidationHandler).createRoutes();
  }

  private _logRoute (): express.Router {
    const router: express.Router = express.Router();
    return new LogRoute(router, this._logHandler,
      this._authValidationHandler).createRoutes();
  }

  private _handleGenericErrors (err: any, req: express.Request,
                                res: express.Response, next: express.NextFunction): void {

    const error = err instanceof ApiError
      ? err
      : new ApiError(ERRORS.INTERNAL_SERVER_ERROR).addCause(err);

    res.status(error.statusCode).json(error.forResponse());
  }

  private _listen (): void {
    this._server.listen(this._port, () => {
      winston.info(`Server started on PORT: ${this._port}`);
    });
  }
}

const server: Server = Server.bootstrap();
export default server.app;
