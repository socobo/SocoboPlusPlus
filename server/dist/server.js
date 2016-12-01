"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var http = require("http");
var Server = (function () {
    function Server() {
        this._createApp();
        this._createServer();
        this._config();
        this._routes();
        this._listen();
    }
    Server.prototype._createApp = function () {
        this._app = express();
    };
    Server.prototype._createServer = function () {
        this._server = http.createServer(this._app);
    };
    Server.prototype._config = function () {
        this._port = process.env.PORT || Server.PORT;
        this._app.use(cors());
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(bodyParser.json());
    };
    Server.prototype._routes = function () {
        var router = express.Router();
        router.get("/", function (req, res, next) {
            res.status(200).json({ message: "Backend Server is ready to rock!" });
        });
        this.app.use(router);
    };
    Server.prototype._listen = function () {
        var _this = this;
        this._server.listen(this._port, function () {
            console.log("Server is running under PORT: " + _this._port);
        });
    };
    Object.defineProperty(Server.prototype, "app", {
        get: function () {
            return this._app;
        },
        enumerable: true,
        configurable: true
    });
    Server.bootstrap = function () {
        return new Server();
    };
    Server.PORT = 8282;
    return Server;
}());
var server = Server.bootstrap();
module.exports = server.app;
