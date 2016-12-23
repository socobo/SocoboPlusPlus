import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as http from "http";
import * as pgPromise from "pg-promise";
import * as path from "path";
// server config
import { Config } from "./config";
// server services
import { UserService } from "./logic/services/user.service";
import { RecipeService } from "./logic/services/recipe.service";
// server routes
import { UsersRouteV1 } from "./routes/api/v1/users/index";
import { RecipeRouteV1 } from "./routes/api/v1/recipes/index";


class Server {
  private _app: express.Application;
  private _server: http.Server;
  private _port: number;
  private _db: pgPromise.IDatabase<any>;

  constructor () {
    this._createApp();
    this._createServer();
    this._configDatabase();
    this._configServer();
    this._configFrontendRoutes();
    this._configApiRoutes();
    this._configRecipeRoutes();
    this._listen();
  }

  private _createApp (): void {
    this._app = express();
  }

  private _createServer (): void {
    this._server = http.createServer(this._app);
  }

  private _configDatabase (): void {    
    // init pgPromise
    const pgp: pgPromise.IMain = pgPromise();
    // setup connectionString
    const connectionString: string = process.env.DATABASE_URL || Config.DATABASE_URL;
    // init db
    this._db = pgp(connectionString);
  }

  private _configServer (): void {
    this._port = process.env.PORT || Config.PORT;
    this._app.use(cors());
    this._app.use(bodyParser.urlencoded({ extended: true }));
    this._app.use(bodyParser.json());
  }

  private _configFrontendRoutes (): void {
    // serve frontend from server/dist/public
    this._app.use(express.static(path.join(__dirname, "public")));
  }

  private _configApiRoutes (): void {
    // create new router
    let router: express.Router = express.Router();
    // init user service
    const userService: UserService = new UserService(this._db);
    // init users route
    const usersApiV1Route: UsersRouteV1 = new UsersRouteV1(userService, router);
    // set users route to path
    this._app.use("/api/v1/users", usersApiV1Route.createRoutes());
  }

  private _configRecipeRoutes(): void {
    // create new router
    let router: express.Router = express.Router();
    // init user service
    const recipeService: RecipeService = new RecipeService(this._db); 
    // init users route
    const recipeApiV1Route: RecipeRouteV1 = new RecipeRouteV1(recipeService, router);
    // set users route to path
    this._app.use("/api/v1/recipes", recipeApiV1Route.createRoutes());
  }
  private _listen (): void {
    this._server.listen(this._port, () => {
      console.log(`Server is running under PORT: ${this._port}`);
    });
  }

  public get app (): express.Application {
    return this._app;
  }

  public static bootstrap (): Server {
    return new Server();
  }
}

// creater server class
let server: Server = Server.bootstrap();
// export application
export default server.app;