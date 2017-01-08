import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as http from "http";
import * as pgPromise from "pg-promise";
import * as path from "path";
import * as winston from "winston";
// server config
import { Config } from "./config";
// server services
import { AuthService } from "./logic/services/auth.service";
import { UserService } from "./logic/services/user.service";
// server routes
import { AuthRouteV1 } from "./routes/api/v1/auth/index";
import { UsersRouteV1 } from "./routes/api/v1/users/index";
import { LogsRouteV1 } from "./routes/api/v1/logs/index";


class Server {
  private _app: express.Application;
  private _server: http.Server;
  private _port: number;
  private _db: pgPromise.IDatabase<any>;

  private _userService: UserService;
  private _authService: AuthService;

  constructor () {
    this._create();
    this._config();
    this._services();
    this._routes();
    this._listen();
  }

  /**
   * CREATION
   */
  private _create (): void {
    this.__createApp();
    this.__createServer();
  }

  private __createApp (): void {
    this._app = express();
  }

  private __createServer (): void {
    this._server = http.createServer(this._app);
  }

  /**
   * CONFIGURATION
   */
  private _config (): void {
    this.__configLogging();
    this.__configDatabase();
    this.__configServer();
  }

  private __configLogging (): void {
    // check environment and setup winston
    switch ((process.env.NODE_ENV || Config.NODE_ENV)) {
      case "test":
        winston.configure({
          transports: [
            new (winston.transports.File) ({
              filename: "logs/server.test.log.json"
            }),
            new (winston.transports.Console) ()
          ]
        });
        break;

      case "development":
        winston.configure({
          transports: [
            new (winston.transports.File) ({
              filename: "logs/server.dev.log.json"
            }),
            new (winston.transports.Console) ()
          ]
        });
        break;

      case "production":
        winston.configure({
          transports: [
            new (winston.transports.File) ({
              filename: "logs/server.log.json"
            }),
            new (winston.transports.Console) ()
          ]
        });
        break;
      
      default:
        throw new Error("NODE_ENV is not known!");
    }
  }

  private __configDatabase (): void {
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

  private __configServer (): void {
    this._port = process.env.PORT || Config.PORT;
    this._app.use(cors());
    this._app.use(bodyParser.urlencoded({ extended: true }));
    this._app.use(bodyParser.json());
  }

  /**
   * SERVICES
   */
  private _services (): void {
    // init user service
    this._userService = new UserService(this._db);
    // init auth service
    this._authService = new AuthService(this._userService);
  }

  /**
   * ROUTES
   */
  private _routes (): void {
    this.__frontendRoutes();
    this.__apiRoutes();
  }

  private __frontendRoutes (): void {
    // serve frontend from server/dist/public
    this._app.use(express.static(path.join(__dirname, "public")));
  }

  private __apiRoutes (): void {
    // set routes to paths
    this._app.use("/api/v1/auth", this.___authRoute());
    this._app.use("/api/v1/users", this.___usersRoute());
    this._app.use("/api/v1/logs", this.___logsRoute());
  }

  private ___authRoute (): express.Router {
    // create new router
    let router: express.Router = express.Router();
    // init and return auth route
    return new AuthRouteV1(this._authService, router).createRoutes();
  }

  private ___usersRoute (): express.Router {
    // create new router
    let router: express.Router = express.Router();
    // init and return users route
    return new UsersRouteV1(this._userService, router).createRoutes();
  }

  private ___logsRoute (): express.Router {
    // create new router
    let router: express.Router = express.Router();
    // init and return logs route
    return new LogsRouteV1(router).createRoutes();
  }

  private _listen (): void {
    this._server.listen(this._port, () => {
      winston.info(`Server started on PORT: ${this._port}`);
    });
  }

  /**
   * PUBLIC API
   */
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