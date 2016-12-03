import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import Server from "./../src/server";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Server", () => {
  it("app property should not null", () => {
    expect(Server).not.null;
  });

  it("route / should retrun json", () => {
    chai.request(Server).get("/")
      .then(res => {
        expect(res.type).to.eql("application/json");
      });
  });

  it("route / should retrun 200 status", () => {
    chai.request(Server).get("/")
      .then(res => {
        expect(res.status).to.eql(200);
      });
  });

  it("route / should return body with message property", () => {
    chai.request(Server).get("/")
      .then(res => {
        expect(res.body).haveOwnProperty("message");
      });
  });
});