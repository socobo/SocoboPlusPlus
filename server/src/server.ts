import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as http from "http";
import * as pgPromise from "pg-promise";
import * as path from "path";
import * as winston from "winston";
// server config
import { Config } from "./config";
// server utils
import { CryptoUtils } from "./logic/utils/cryptoUtils";
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

  private _cryptoUtils: CryptoUtils;

  private _userService: UserService;
  private _authService: AuthService;

  constructor () {
    this._create();
    this._config();
    this._utils();
    this._services();
    this._routes();
    this._listen();
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
    // check environment
    if ((process.env.NODE_ENV || Config.NODE_ENV) !== "test") {
      winston.configure({
        transports: [
          new (winston.transports.File) ({
            filename: "server/logs/server.log.json"
          }),
          new (winston.transports.Console) ()
        ]
      });
    } else {
      winston.configure({
        transports: [
          new (winston.transports.File) ({
            filename: "server/logs/server.test.log.json"
          }),
          new (winston.transports.Console) ()
        ]
      });
    }
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
    // init auth service
    this._authService = new AuthService(this._userService, this._cryptoUtils);
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
    this._app.use("/api/v1/logs", this._logsRoute());
  }

  private _authRoute (): express.Router {
    // create new router
    let router: express.Router = express.Router();
    // init and return auth route
    return new AuthRouteV1(this._authService, router).createRoutes();
  }

  private _usersRoute (): express.Router {
    // create new router
    let router: express.Router = express.Router();
    // init and return users route
    return new UsersRouteV1(this._userService, router).createRoutes();
  }

  private _logsRoute (): express.Router {
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