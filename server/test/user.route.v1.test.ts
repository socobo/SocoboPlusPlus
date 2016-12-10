import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import Server from "./../src/server";
import { SocoboUser } from "./../src/models/socobouser";

chai.use(chaiHttp);
const expect = chai.expect;

describe("User Route v1", () => {

  let users: SocoboUser[];

  before((done) => {
    let user1: SocoboUser = new SocoboUser();
    user1.id = 1;
    user1.username = "JohnDoe";
    user1.password = "SuperSecurePassword";

    let user2: SocoboUser = new SocoboUser();
    user2.id = 2;
    user2.username = "MaxMustermann";
    user2.password = "SuperMegaSecure";

    this.users = [user1, user2];

    done();
  });

  it("route /api/v1/users should return json", () => {
    chai.request(Server).get("/api/v1/users")
      .then(res => {
        expect(res.type).to.eql("application/json");
      });
  });

  it("route /api/v1/users should return 2 users", () => {
    chai.request(Server).get("/api/v1/users")
      .then(res => {
        expect(res.body).to.deep.equal(this.users);
      });
  });

  it("route /api/v1/users/1 sholud return one user", () => {
    chai.request(Server).get("/api/v1/users/1")
      .then(res => {
        expect(res.body).to.deep.equal(this.users[0]);
      });
  });

  it(`route /api/v1/users/1 should return one user with 
      id, username, password property`, () => {
        chai.request(Server).get("/api/v1/users/1")
          .then(res => {
            expect(res.body).to.haveOwnProperty("id");
            expect(res.body).to.haveOwnProperty("username");
            expect(res.body).to.haveOwnProperty("password");
          }); 
  });
});