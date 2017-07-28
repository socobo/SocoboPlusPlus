process.env["NODE_ENV"] = "test";

import * as chai from "chai";
import * as mocha from "mocha";
import Server from "./../src/server";

describe("Server", () => {
  it("app property should not null", () => {
    chai.expect(Server).not.null;
  });
});
