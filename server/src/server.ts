import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as http from "http";


class Server {
  private readonly PORT: number = 8282;
  private _app: express.Application;
  private _server: http.Server;
  private _port: number;

  constructor () {
    this._createApp();
    this._createServer();
    this._config();
    this._routes();
    this._listen();
  }

  private _createApp (): void {
    this._app = express();
  }

  private _createServer (): void {
    this._server = http.createServer(this._app);
  }

  private _config (): void {
    this._port = process.env.PORT || this.PORT;
    this._app.use(cors());
    this._app.use(bodyParser.urlencoded({ extended: true }));
    this._app.use(bodyParser.json());
  }

  private _routes (): void {
    let router: express.Router = express.Router();

    router.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(200).json({message: "Backend Server is ready to rock!"});
    });

    this.app.use(router);
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
let server = Server.bootstrap();
// export application
export = server.app;