process.env.NODE_ENV = "test";

import * as mocha from "mocha";
import * as chai from "chai"; 

import { LogService } from "./../src/logic/services/log.service";
import { 
  ApiError, DbError 
} from "./../src/models/index";
import { ERRORS } from "./../src/errors"

import * as winston from "winston";
import * as sinon from "sinon";
const SpyLogger = require("winston-spy"); 



describe("LogService", () => {
  
  let spy: sinon.SinonSpy;

  before(done => {
    spy = sinon.spy();

    winston.remove(winston.transports.Console);
    winston.remove(winston.transports.File);

    winston.add(SpyLogger, { spy: spy });

    done();
  });

  it("Error Log should contain newly created errors", () => {
<<<<<<< HEAD:server/test/logging.service.test.ts

    let apiError = new ApiError(ERRORS.INTERNAL_SERVER_ERROR);
    apiError.source = "LoggingServiceTest";
    apiError.sourceMethod = "Method1()";
    apiError.forResponse()

    let dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR);
    dbError.source = "LoggingServiceTest";
    dbError.sourceMethod = "Method1()";
    dbError.forResponse()
=======
    let apiError: ApiError = new ApiError("Api Error Test Message", "LogServiceTest", "Method1()", new Error());
    let dbError: DbError = new DbError("Db Error Test Message", "LogServiceTest", "Method2()", new Error());
>>>>>>> 26-improve-naming-of-files-and-classes:server/test/log.service.test.ts

    let errors: ApiError[] = LogService.getErrors();

    chai.expect(errors).to.include(apiError);
    chai.expect(errors).to.include(dbError);
  });

  it("Error Log should printed to the console and write to log file", () => {
<<<<<<< HEAD:server/test/logging.service.test.ts
    let e = new ApiError(ERRORS.INTERNAL_SERVER_ERROR);
    e.source = "LoggingServiceTest";
    e.sourceMethod = "Method1()";
    e.forResponse()
=======
    let apiError: ApiError = new ApiError("Api Error Test Message", "LogServiceTest", "Method1()", new Error());
>>>>>>> 26-improve-naming-of-files-and-classes:server/test/log.service.test.ts

    chai.assert(spy.called);
    chai.assert(spy.calledWith("error", "Internal server error"));
  });

  it("Logged errors should contain all needed properties", () => {
<<<<<<< HEAD:server/test/logging.service.test.ts

    let apiError = new ApiError(ERRORS.INTERNAL_SERVER_ERROR);
    apiError.source = "LoggingServiceTest";
    apiError.sourceMethod = "Method1()";
    apiError.forResponse()

    let dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR);
    dbError.source = "LoggingServiceTest";
    dbError.sourceMethod = "Method1()";
    dbError.forResponse()
=======
    let apiError: ApiError = new ApiError("Api Error Test Message", "LogServiceTest", "Method1()", new Error());
    let dbError: DbError = new DbError("Db Error Test Message", "LogServiceTest", "Method2()", new Error());
>>>>>>> 26-improve-naming-of-files-and-classes:server/test/log.service.test.ts

    let errors: ApiError[] = LogService.getErrors();

    chai.expect(errors[0]).to.contain.all.keys("timestamp", "error", "message", "source", "sourceMethod")
    chai.expect(errors[0]).not.to.have.any.keys("query")
    chai.expect(errors[1]).to.contain.all.keys("timestamp", "error", "message", "source", "sourceMethod", "query")
  });
});