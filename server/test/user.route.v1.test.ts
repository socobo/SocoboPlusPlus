process.env.NODE_ENV = "test";

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
    user1.email = "john-doe@test.test";
    // user1.password = "SuperSecurePassword";
    user1.image = "http://placehold.it/350x150";
    user1.hasTermsAccepted = true;
    user1.isAdmin = false;
    user1.provider = "email";

    let user2: SocoboUser = new SocoboUser();
    user2.id = 2;
    user2.username = "MaxMustermann";
    user2.email = "max-mustermann@test.test";
    // user2.password = "SuperMegaSecure";
    user2.image = "http://placehold.it/350x150";
    user2.hasTermsAccepted = true;
    user2.isAdmin = false;
    user2.provider = "email";

    users = [user1, user2];

    done();
  });

  it("route /api/v1/users should return json", () => {

    chai.request(Server).post("/api/v1/auth/login")
      .send({email: "john-doe@test.test", password: "SuperSecurePassword"})
      .then((result: any) => {

        let token: string = result.token;

        chai.request(Server).get("/api/v1/users").set("x-access-token", token)
          .then(res => {
            expect(res.type).to.eql("application/json");
          })
          .catch(err => {
            expect(err.message).equal("Bad Request");
          });

      })
      .catch((error: any) => console.error(error));
  });

  it("route /api/v1/users should return 2 users", () => {

    chai.request(Server).post("/api/v1/auth/login")
      .send({email: "john-doe@test.test", password: "SuperSecurePassword"})
      .then((result: any) => {
        
        let token: string = result.token;

        chai.request(Server).get("/api/v1/users").set("x-access-token", token)
          .then(res => {
            expect(res.body).to.deep.equal(users);
          })
          .catch(err => {
            expect(err.message).equal("The 'AllUsers' Request are failed!");
          });

      })
      .catch((error: any) => console.error(error));
  });

  it("route /api/v1/users/1 sholud return one user", () => {

    chai.request(Server).post("/api/v1/auth/login")
      .send({email: "john-doe@test.test", password: "SuperSecurePassword"})
      .then((result: any) => {

        let token: string = result.token;

        chai.request(Server).get("/api/v1/users/1").set("x-access-token", token)
          .then(res => {
            expect(res.body).to.deep.equal(users[0]);
          })
          .catch(err => {
            expect(err.message).equal("The 'GetUserById' Request with the Id: 1 are failed!");
          });

      })
      .catch((error: any) => console.error(error));
  });

  it(`route /api/v1/users/1 should return one user with 
      id, username, password property`, () => {

        chai.request(Server).post("/api/v1/auth/login")
          .send({email: "john-doe@test.test", password: "SuperSecurePassword"})
          .then((result: any) => {

            let token: string = result.token;

            chai.request(Server).get("/api/v1/users/1").set("x-access-token", token)
              .then(res => {
                expect(res.body).to.haveOwnProperty("id");
                expect(res.body).to.haveOwnProperty("username");
                expect(res.body).to.haveOwnProperty("password");
              })
              .catch(err => {
                expect(err.message).equal("The 'GetUserById' Request with the Id: 1 are failed!");
              }); 
          })
          .catch((error: any) => console.error(error));
  });
});