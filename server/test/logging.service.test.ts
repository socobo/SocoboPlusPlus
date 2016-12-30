process.env.NODE_ENV = "test";

import * as mocha from "mocha";
import * as chai from "chai"; 

import { LogService } from "./../src/logic/services/logging.service";
import { ApiError } from "./../src/models/api-error";
import { DbError } from "./../src/models/db-error";

import * as winston from "winston";
import * as sinon from "sinon";
const SpyLogger = require("winston-spy"); 

describe("LogService", () => {
  
  let spy: sinon.SinonSpy;

  before(done => {
    spy = sinon.spy();

    try{
      winston.remove(winston.transports.Console);
      winston.remove(winston.transports.File);
    }catch(error){
      // Winston throws an error if the Transport is not attached to the current instance
      console.log(error);
    }

    winston.add(SpyLogger, { spy: spy });

    done();
  });

  it("Error Log should contain newly created errors", () => {
    let apiError: ApiError = new ApiError("Api Error Test Message", "LoggingServiceTest", "Method1()", new Error());
    let dbError: DbError = new DbError("Db Error Test Message", "LoggingServiceTest", "Method2()", new Error());

    let errors: ApiError[] = LogService.getErrors();

    chai.expect(errors).to.include(apiError);
    chai.expect(errors).to.include(dbError);
  });

  it("Error Log should printed to the console and write to log file", () => {
    let apiError: ApiError = new ApiError("Api Error Test Message", "LoggingServiceTest", "Method1()", new Error());

    chai.assert(spy.called);
    chai.assert(spy.calledWith("error", "Api Error Test Message"));
  });

  it("Logged errors should contain all needed properties", () => {
    let apiError: ApiError = new ApiError("Api Error Test Message", "LoggingServiceTest", "Method1()", new Error());
    let dbError: DbError = new DbError("Db Error Test Message", "LoggingServiceTest", "Method2()", new Error());

    let errors: ApiError[] = LogService.getErrors();

    chai.expect(errors[0]).to.have.all.keys("timestamp", "stackTrace", "name", "message", "source", "sourceMethod")
    chai.expect(errors[0]).not.to.have.any.keys("query")
    chai.expect(errors[1]).to.have.all.keys("timestamp", "stackTrace", "name", "message", "source", "sourceMethod", "query")
  });
});