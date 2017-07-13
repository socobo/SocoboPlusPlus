process.env.NODE_ENV = "test";

import * as chai from "chai";
import * as mocha from "mocha";
import * as sinon from "sinon";
import * as winston from "winston";
import { ApiError, DbError, ERRORS, LogService } from "./../src/app/index";

describe("Log Service", () => {

  const spyLogger = require("winston-spy");
  let spy: sinon.SinonSpy;

  before ((done: MochaDone) => {
    spy = sinon.spy();

    winston.remove(winston.transports.Console);
    winston.remove(winston.transports.File);
    winston.add(spyLogger, { spy });

    done();
  });

  it("Error Log should contain newly created errors", () => {

    const apiError = new ApiError(ERRORS.INTERNAL_SERVER_ERROR);
    apiError.source = "LoggingServiceTest";
    apiError.sourceMethod = "Method1()";
    apiError.forResponse();

    const dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR);
    dbError.source = "LoggingServiceTest";
    dbError.sourceMethod = "Method1()";
    dbError.forResponse();

    const errors: ApiError[] = LogService.getErrors();

    chai.expect(errors).to.include(apiError);
    chai.expect(errors).to.include(dbError);
  });

  it("Error Log should printed to the console and write to log file", () => {
    const e = new ApiError(ERRORS.INTERNAL_SERVER_ERROR)
      .addSource("LoggingServiceTest")
      .addSourceMethod("Method1()");
    e.forResponse();

    chai.assert(spy.called);
    chai.assert(spy.calledWith("error", "Internal server error"));
  });

  it("Logged errors should contain all needed properties", () => {

    const apiError = new ApiError(ERRORS.INTERNAL_SERVER_ERROR)
      .addSource("LoggingServiceTest")
      .addSourceMethod("Method1()");
    apiError.forResponse();

    const dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
      .addSource("LoggingServiceTest")
      .addSourceMethod("Method1()");
    dbError.forResponse();

    const errors: ApiError[] = LogService.getErrors();

    chai.expect(errors[0]).to.contain.all.keys("timestamp", "error", "message", "source", "sourceMethod");
    chai.expect(errors[0]).not.to.have.any.keys("query");
    chai.expect(errors[1]).to.contain.all.keys("timestamp", "error", "message", "source", "sourceMethod", "query");
  });
});
