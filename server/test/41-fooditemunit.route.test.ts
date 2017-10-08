/*tslint:disable:no-unused-expression*/

process.env["NODE_ENV"] = "test";

import * as chai from "chai";
import chaiHttp = require("chai-http");
import * as mocha from "mocha";
import Server from "./../src/server";

chai.use(chaiHttp);

/*tslint:enable:no-unused-expression*/
