process.env["NODE_ENV"] = "test";

import { expect } from "chai";
import * as mocha from "mocha";
import Server from "./../src/server";

describe("Server", () => {
  it("app property should not null", () => {
    expect(Server.app).not.null;
  });
});
