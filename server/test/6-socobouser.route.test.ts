/*tslint:disable:no-unused-expression*/

process.env["NODE_ENV"] = "test";

import * as chai from "chai";
import chaiHttp = require("chai-http");
import { readFileSync } from "fs";
import * as mocha from "mocha";
import Server from "./../src/server";
import {
  SocoboUser, SocoboUserProviderType, SocoboUserRoleType, SocoboUserUpdateType
} from "./../src/socobouser/index";

chai.use(chaiHttp);

describe("SocoboUserRoute - API v1", () => {

  const expect = chai.expect;

  // define login function
  // User 1 PW: SuperSecurePassword
  // User 2 PW: SuperMegaSecure
  // User 3 PW: password
  const login = async (role: SocoboUserRoleType): Promise<string|any> => {
    const user = (role === SocoboUserRoleType.Admin)
      ? { email: "admin2@test.test", password: "password" }
      : { email: "john-doe@test.test", password: "SuperSecurePassword" };

    try {
      const result = await chai.request(Server).post("/api/v1/auth/login").send(user);
      return result.body.token;
    } catch (error) {
      return error;
    }
  };

  it("GET /api/v1/socobouser should fail if user is not an admin", async () => {
    try {
      const accessToken = await login(SocoboUserRoleType.User);
    } catch (error) {
      expect(error.message).to.be.eql("The user has unsufficient permission to access the requested resource");
      expect(error.method).to.be.eql("checkValidUser(..)");
      expect(error.source).to.be.eql("AuthValidationMiddleware");
    }
  });

  it("GET /api/v1/socobouser should pass if user is an admin", async () => {
    const accessToken = await login(SocoboUserRoleType.Admin);
    const result = await chai.request(Server).get("/api/v1/socobouser").set("x-access-token", accessToken);
    expect(result.body).to.not.null;
  });

  it("GET /api/v1/socobouser should return json", async () => {
    const accessToken = await login(SocoboUserRoleType.Admin);
    const result = await chai.request(Server).get("/api/v1/socobouser").set("x-access-token", accessToken);
    expect(result.type).to.eql("application/json");
  });

  it("GET /api/v1/socobouser should return all users", async () => {
    const accessToken = await login(SocoboUserRoleType.Admin);
    const result = await chai.request(Server).get("/api/v1/socobouser").set("x-access-token", accessToken);
    expect(result.body.length).to.equal(6);
  });

  it("GET /api/v1/socobouser/:id should return one user", async () => {
    const id = "59a2ee5be2c06ab513940b84";
    const accessToken = await login(SocoboUserRoleType.Admin);
    const resultOne = await chai.request(Server).get(`/api/v1/socobouser/${id}`).set("x-access-token", accessToken);
    expect(resultOne.body).to.not.null;
  });

  it("GET /api/v1/socobouser/:id should return one user without password property", async () => {
    const id = "59a2ee5be2c06ab513940b84";
    const accessToken = await login(SocoboUserRoleType.Admin);
    const resultOne = await chai.request(Server).get(`/api/v1/socobouser/${id}`).set("x-access-token", accessToken);
    expect(resultOne.body).to.deep.property("id");
    expect(resultOne.body).to.deep.property("username");
    expect(resultOne.body).to.deep.property("email");
    expect(resultOne.body).to.deep.property("hasTermsAccepted");
    expect(resultOne.body).to.deep.property("role");
    expect(resultOne.body).to.deep.property("provider");
    expect(resultOne.body).to.deep.property("imageUrl");
    expect(resultOne.body).to.deep.property("created");
    expect(resultOne.body).to.deep.property("lastModified");
    expect(resultOne.body).to.not.deep.property("password");
  });

  it("PUT /api/v1/socobouser/:id should update the user and return modified user", async () => {
    const id = "59a2ee5be2c06ab513940b84";
    const accessToken = await login(SocoboUserRoleType.Admin);
    const resultBefore = await chai.request(Server).get(`/api/v1/socobouser/${id}`).set("x-access-token", accessToken);

    const updateRequestBody = {
      fieldsToUpdate: { username: "HansPeter" },
      updateType: SocoboUserUpdateType.username
    };

    const resultAfter = await chai.request(Server)
      .put(`/api/v1/socobouser/${id}`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send(updateRequestBody);

    expect(resultAfter.body.username).to.equal("HansPeter");
    expect(resultAfter.body.username).to.not.equal(resultBefore.body.username);
    expect(resultAfter.body.lastModified).to.not.equal(resultBefore.body.lastModified);
  });

  it("POST /api/v1/socobouser/:id/upload should save a new user image and return the modified user", async () => {
    const id = "59a2ee5be2c06ab513940b84";
    const accessToken = await login(SocoboUserRoleType.Admin);
    const resultBefore = await chai.request(Server).get(`/api/v1/socobouser/${id}`).set("x-access-token", accessToken);

    const resultAfter = await chai.request(Server)
      .post(`/api/v1/socobouser/${id}/upload`)
      .set("x-access-token", accessToken)
      .attach("socoboUserImage", readFileSync(`${__dirname}/img/image.jpg`), "image.jpg");

    expect(resultAfter.body.imageUrl).to.not.equal(resultBefore.body.imageUrl);
    expect(resultAfter.body.lastModified).to.not.equal(resultBefore.body.lastModified);
  });

  it("DELETE /api/v1/socobouser/:id should delete the user and return the removed user id", async () => {
    const id = "59a2ee5be2c06ab513940b84";
    const accessToken = await login(SocoboUserRoleType.Admin);
    const resultDelete = await chai.request(Server).del(`/api/v1/socobouser/${id}`).set("x-access-token", accessToken);

    expect(resultDelete.body.id).to.equal(id);
  });
});

/*tslint:enable:no-unused-expression*/