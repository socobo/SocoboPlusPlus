process.env["NODE_ENV"] = "test";

import * as chai from "chai";
import * as mocha from "mocha";
import chaiHttp = require("chai-http");
import { ProviderType, Role, SocoboUser } from "./../src/models/index";
import Server from "./../src/server";

chai.use(chaiHttp);

describe("User Route v1", () => {

  const expect = chai.expect;

  // define login function
  const login = (): Promise<string> => {
    return new Promise((resolve, reject) => {
       chai.request(Server).post("/api/v1/auth/login")
        .send({email: "john-doe@test.test", password: "SuperSecurePassword"})
        .then((result: any) => resolve(result.token))
        .catch((error: any) => reject(error));
    });
  };

  // define SocoboUsers Array
  let users: SocoboUser[];

  before((done) => {
    const user1: SocoboUser = new SocoboUser();
    user1.id = 1;
    user1.username = "john-doe@test.test";
    user1.email = "john-doe@test.test";
    // user1.password = "SuperSecurePassword";
    user1.image = "http://placehold.it/350x150";
    user1.hasTermsAccepted = true;
    user1.role = Role.User;
    user1.provider = ProviderType.Email;

    const user2: SocoboUser = new SocoboUser();
    user2.id = 2;
    user2.username = "MaxMustermann";
    user2.email = "MaxMustermann";
    // user2.password = "SuperMegaSecure";
    user2.image = "http://placehold.it/350x150";
    user2.hasTermsAccepted = true;
    user2.role = Role.User;
    user2.provider = ProviderType.Username;

    const user3: SocoboUser = new SocoboUser();
    user3.id = 3;
    user3.username = "admin@test.test";
    user3.email = "admin@test.test";
    // user3.password = "password";
    user3.image = "http://placehold.it/350x150";
    user3.hasTermsAccepted = true;
    user3.role = Role.Admin;
    user3.provider = ProviderType.Email;

    users = [user1, user2, user3];

    done();
  });

  it("route /api/v1/users should return json", () => {

    login().then((token: string) => {

      chai.request(Server).get("/api/v1/users").set("x-access-token", token)
        .then((res: ChaiHttp.Response) => {
          expect(res.type).to.eql("application/json");
        })
        .catch((err: any) => {
          expect(err.message).equal("Bad Request");
        });

    }).catch((error: any) => console.error(error.message));

  });

  it("route /api/v1/users should return 3 users", () => {

    login().then((token: string) => {

      chai.request(Server).get("/api/v1/users").set("x-access-token", token)
        .then((res: ChaiHttp.Response) => {
          expect(res.body).to.deep.equal(users);
          expect(res.body.length).to.equal(3);
        })
        .catch((err: any) => {
          expect(err.message).equal("The 'AllUsers' Request are failed!");
        });

    }).catch((error: any) => console.error(error));

  });

  it("route /api/v1/users/1 sholud return one user", () => {

    login().then((token: string) => {

      chai.request(Server).get("/api/v1/users/1").set("x-access-token", token)
        .then((res: ChaiHttp.Response) => {
          expect(res.body).to.deep.equal(users[0]);
        })
        .catch((err: any) => {
          expect(err.message).equal("The 'GetUserById' Request with the Id: 1 are failed!");
        });

    }).catch((error: any) => console.error(error));

  });

  it("route /api/v1/users/1 should return one user without password property", () => {

        login().then((token: string) => {

          chai.request(Server).get("/api/v1/users/1").set("x-access-token", token)
            .then((res: ChaiHttp.Response) => {
              expect(res.body).to.haveOwnProperty("id");
              expect(res.body).to.haveOwnProperty("username");
              expect(res.body).to.haveOwnProperty("email");
              expect(res.body).to.haveOwnProperty("image");
              expect(res.body).to.haveOwnProperty("hastermsaccepted");
              expect(res.body).to.haveOwnProperty("isadmin");
              expect(res.body).to.haveOwnProperty("provider");
              expect(res.body).to.haveOwnProperty("created");
              expect(res.body).to.haveOwnProperty("lastmodified");
              expect(res.body).to.not.haveOwnProperty("password");
            })
            .catch((err: any) => {
              expect(err.message).equal("The 'GetUserById' Request with the Id: 1 are failed!");
            });

        }).catch((error: any) => console.error(error));

  });
});
