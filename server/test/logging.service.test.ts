import * as mocha from "mocha";
import * as chai from "chai";

import { LogService } from "./../src/logic/services/logging.service";
import { ApiError } from "./../src/models/api-error";
import { DbError } from "./../src/models/db-error";

describe("LogService", () => {
  
  it("Error Log should contain newly created errors", () => {
    let apiError: ApiError = new ApiError('Api Error Test Message', new Error());
    let dbError: DbError = new DbError('Db Error Test Message', new Error());

    let errors: ApiError[] = LogService.getErrors();

    chai.expect(errors).to.include(apiError);
    chai.expect(errors).to.include(dbError);
  });

  it("Logged errors should contain all needed properties", () => {
    let apiError: ApiError = new ApiError('Api Error Test Message', new Error());
    let dbError: DbError = new DbError('Db Error Test Message', new Error());

    let errors: ApiError[] = LogService.getErrors();

    chai.expect(errors[0]).to.have.all.keys('timestamp', 'stackTrace', 'name', 'message')
    chai.expect(errors[0]).not.to.have.any.keys('query')
    chai.expect(errors[1]).to.have.all.keys('timestamp', 'stackTrace', 'name', 'message','query')
  });
});