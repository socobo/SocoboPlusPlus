/*tslint:disable:no-console*/

process.env["NODE_ENV"] = "test";

import * as chai from "chai";
import chaiHttp = require("chai-http");
import * as mocha from "mocha";
import * as mongoose from "mongoose";
import Server from "./../src/server";
import { SocoboUser, SocoboUserProviderType, SocoboUserRoleType } from "./../src/socobouser/index";

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
    // PW: SuperSecurePassword
    const user1: SocoboUser = new SocoboUser();
    user1.id = new mongoose.Types.ObjectId(123456);
    user1.username = "john-doe@test.test";
    user1.email = "john-doe@test.test";
    user1.hasTermsAccepted = true;
    user1.provider = SocoboUserProviderType.Email;
    user1.role = SocoboUserRoleType.User;
    user1.imageUrl = "tmp_data/user.png";

    // PW: SuperMegaSecure
    const user2: SocoboUser = new SocoboUser();
    user2.id = new mongoose.Types.ObjectId(98765);
    user2.username = "MaxMustermann";
    user2.email = "MaxMustermann";
    user2.hasTermsAccepted = true;
    user2.provider = SocoboUserProviderType.Username;
    user2.role = SocoboUserRoleType.User;
    user2.imageUrl = "tmp_data/user.png";

    // PW: password
    const user3: SocoboUser = new SocoboUser();
    user3.id = new mongoose.Types.ObjectId(34113);
    user3.username = "admin@test.test";
    user3.email = "admin@test.test";
    user3.hasTermsAccepted = true;
    user3.provider = SocoboUserProviderType.Email;
    user3.role = SocoboUserRoleType.Admin;
    user3.imageUrl = "tmp_data/user.png";

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
              expect(res.body).to.deep.property("id");
              expect(res.body).to.deep.property("socoboUserImageId");
              expect(res.body).to.deep.property("socoboUserRoleId");
              expect(res.body).to.deep.property("socoboUserProviderId");
              expect(res.body).to.deep.property("username");
              expect(res.body).to.deep.property("email");
              expect(res.body).to.deep.property("hastermsaccepted");
              expect(res.body).to.deep.property("created");
              expect(res.body).to.deep.property("lastmodified");
              expect(res.body).to.not.deep.property("password");
            })
            .catch((err: any) => {
              expect(err.message).equal("The 'GetUserById' Request with the Id: 1 are failed!");
            });

        }).catch((error: any) => console.error(error));

  });
});
/*tslint:enable:no-console*/
