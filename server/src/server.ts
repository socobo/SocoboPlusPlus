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
import { UserService } from "./logic/services/user.service";
// server routes
import { UsersRouteV1 } from "./routes/api/v1/users/index";
import { LogsRouteV1 } from "./routes/api/v1/logs/index";


class Server {
  private _app: express.Application;
  private _server: http.Server;
  private _port: number;
  private _db: pgPromise.IDatabase<any>;

  constructor () {
    this._createApp();
    this._createServer();
    this._configLogging();
    this._configDatabase();
    this._configServer();
    this._configFrontendRoutes();
    this._configApiRoutes();
    this._listen();
  }

  private _createApp (): void {
    this._app = express();
  }

  private _createServer (): void {
    this._server = http.createServer(this._app);
  }

  private _configLogging (): void {
    // check environment
    if ((process.env.NODE_ENV || Config.NODE_ENV) !== "test") {
      winston.configure({
        transports: [
          new (winston.transports.File) ({
            filename: "logs/server.log.json"
          }),
          new (winston.transports.Console) ()
        ]
      });
    } else {
      winston.configure({
        transports: [
          new (winston.transports.File) ({
            filename: "logs/server.test.log.json"
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

  private _configFrontendRoutes (): void {
    // serve frontend from server/dist/public
    this._app.use(express.static(path.join(__dirname, "public")));
  }

  private _configApiRoutes (): void {
    // set routes to paths
    this._app.use("/api/v1/users", this.__usersRoute());
    this._app.use("/api/v1/logs", this.__logsRoute());
  }

  private __usersRoute (): express.Router {
    // create new router
    let router: express.Router = express.Router();
    // init user service
    const userService: UserService = new UserService(this._db);
    // init and return users route
    return new UsersRouteV1(userService, router).createRoutes();
  }

  private __logsRoute (): express.Router {
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