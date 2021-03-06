process.env["NODE_ENV"] = "test";

import { expect } from "chai";
import { readFileSync } from "fs";
import * as mocha from "mocha";
import {
  SocoboUser, SocoboUserProviderType, SocoboUserRoleType, SocoboUserUpdateType
} from "./../src/socobouser/index";
import { TestHelper } from "./helper/TestHelper";

describe("SocoboUserRoute - API v1", () => {

  beforeEach(async () => {
    await TestHelper.setUpSocoboUsersDb();
  });

  it("GET /api/v1/socobouser should fail if user is not an admin", async () => {
    try {
      const accessToken = await TestHelper.getToken(SocoboUserRoleType.User);
    } catch (error) {
      expect(error.message).to.be.eql("The user has unsufficient permission to access the requested resource");
      expect(error.method).to.be.eql("checkValidUser(..)");
      expect(error.source).to.be.eql("AuthValidationMiddleware");
    }
  });

  it("GET /api/v1/socobouser should pass if user is an admin", async () => {
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.Admin, true);
    const result = await TestHelper.getAgent().get("/api/v1/socobouser").set("x-access-token", accessToken);
    expect(result.body).to.not.null;
  });

  it("GET /api/v1/socobouser should return json", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get("/api/v1/socobouser").set("x-access-token", accessToken);
    expect(result.type).to.eql("application/json");
  });

  it("GET /api/v1/socobouser should return all users", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get("/api/v1/socobouser")
      .set("x-access-token", accessToken);
    expect(result.body.length).to.equal(4);
  });

  it("GET /api/v1/socobouser/:id should return one user", async () => {
    const id = "59a2ee5be2c06ab513940b84";
    const accessToken = await TestHelper.getToken();
    const resultOne = await TestHelper.getAgent().get(`/api/v1/socobouser/${id}`)
      .set("x-access-token", accessToken);
    expect(resultOne.body).to.not.null;
  });

  it("GET /api/v1/socobouser/:id should return one user without password property", async () => {
    const id = "59a2ee5be2c06ab513940b84";
    const accessToken = await TestHelper.getToken();
    const resultOne = await TestHelper.getAgent().get(`/api/v1/socobouser/${id}`)
      .set("x-access-token", accessToken);
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
    const accessToken = await TestHelper.getToken();
    const resultBefore = await TestHelper.getAgent().get(`/api/v1/socobouser/${id}`).set("x-access-token", accessToken);

    const updateRequestBody = {
      fieldsToUpdate: { username: "HansPeter" },
      updateType: SocoboUserUpdateType.username
    };

    const resultAfter = await TestHelper.getAgent()
      .put(`/api/v1/socobouser/${id}`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send(updateRequestBody);

    expect(resultAfter.body.username).to.equal("HansPeter");
    expect(resultAfter.body.username).to.not.equal(resultBefore.body.username);
    expect(resultAfter.body.lastModified).to.not.equal(resultBefore.body.lastModified);
  });

  it("PUT /api/v1/socobouser/:id should fail if no updateType is provided", async () => {
    const accessToken = await TestHelper.getToken();
    const resultAll = await TestHelper.getAgent().get("/api/v1/socobouser").set("x-access-token", accessToken);
    const id = resultAll.body[0].id;
    const resultBefore = await TestHelper.getAgent().get(`/api/v1/socobouser/${id}`).set("x-access-token", accessToken);

    try {
      const updateRequestBody = {
        fieldsToUpdate: { username: "HansPeter" }
      };

      const resultAfter = await TestHelper.getAgent()
        .put(`/api/v1/socobouser/${id}`)
        .set("x-access-token", accessToken)
        .set("Content-Type", "application/json")
        .send(updateRequestBody);

    } catch (error) {
      expect(error.status).to.be.eql(400);
      const msg = "There is no update type provided. This is required for updating a user.";
      expect(error.response.body).to.have.property("message", msg);
      expect(error.response.body).to.have.property("method", "checkUpdateType(..)");
      expect(error.response.body).to.have.property("source", "SocoboUserMiddleware");
    }
  });

  it("PUT /api/v1/socobouser/:id should fail if no fieldsToUpdate is provided", async () => {
    const accessToken = await TestHelper.getToken();
    const resultAll = await TestHelper.getAgent().get("/api/v1/socobouser").set("x-access-token", accessToken);
    const id = resultAll.body[0].id;
    const resultBefore = await TestHelper.getAgent().get(`/api/v1/socobouser/${id}`).set("x-access-token", accessToken);

    try {
      const updateRequestBody = {
        updateType: SocoboUserUpdateType.username
      };

      const resultAfter = await TestHelper.getAgent()
        .put(`/api/v1/socobouser/${id}`)
        .set("x-access-token", accessToken)
        .set("Content-Type", "application/json")
        .send(updateRequestBody);

    } catch (error) {
      expect(error.status).to.be.eql(400);
      expect(error.response.body).to.have.property("message", "The provided update type is invalid!");
      expect(error.response.body).to.have.property("method", "checkUpdateBody(..)");
      expect(error.response.body).to.have.property("source", "SocoboUserMiddleware");
      expect(error.response.body).to.have.property("validationErrors");
      expect(error.response.body.validationErrors).to.have.length(1);
      expect(error.response.body.validationErrors[0]).to.eql("No fieldsToUpdate provided");
    }
  });

  it("PUT /api/v1/socobouser/:id should fail if an empty fieldsToUpdate is provided", async () => {
    const accessToken = await TestHelper.getToken();
    const resultAll = await TestHelper.getAgent().get("/api/v1/socobouser").set("x-access-token", accessToken);
    const id = resultAll.body[0].id;
    const resultBefore = await TestHelper.getAgent().get(`/api/v1/socobouser/${id}`).set("x-access-token", accessToken);

    try {
      const updateRequestBody = {
        fieldsToUpdate: { },
        updateType: SocoboUserUpdateType.username
      };

      const resultAfter = await TestHelper.getAgent()
        .put(`/api/v1/socobouser/${id}`)
        .set("x-access-token", accessToken)
        .set("Content-Type", "application/json")
        .send(updateRequestBody);

    } catch (error) {
      expect(error.status).to.be.eql(400);
      expect(error.response.body).to.have.property("message", "The provided update type is invalid!");
      expect(error.response.body).to.have.property("method", "checkUpdateBody(..)");
      expect(error.response.body).to.have.property("source", "SocoboUserMiddleware");
      expect(error.response.body).to.have.property("validationErrors");
      expect(error.response.body.validationErrors).to.have.length(2);
      expect(error.response.body.validationErrors[0]).to.eql("Invalid Property length");
      expect(error.response.body.validationErrors[1]).to.eql("Username is missing");
    }
  });

  it("PUT /api/v1/socobouser/:id should fail if wrong fieldsToUpdate is provided for updateType", async () => {
    const accessToken = await TestHelper.getToken();
    const resultAll = await TestHelper.getAgent().get("/api/v1/socobouser").set("x-access-token", accessToken);
    const id = resultAll.body[0].id;
    const resultBefore = await TestHelper.getAgent().get(`/api/v1/socobouser/${id}`).set("x-access-token", accessToken);

    try {
      const updateRequestBody = {
        fieldsToUpdate: { imageUrl: "./tmp.png" },
        updateType: SocoboUserUpdateType.username
      };

      const resultAfter = await TestHelper.getAgent()
        .put(`/api/v1/socobouser/${id}`)
        .set("x-access-token", accessToken)
        .set("Content-Type", "application/json")
        .send(updateRequestBody);

    } catch (error) {
      expect(error.status).to.be.eql(400);
      expect(error.response.body).to.have.property("message", "The provided update type is invalid!");
      expect(error.response.body).to.have.property("method", "checkUpdateBody(..)");
      expect(error.response.body).to.have.property("source", "SocoboUserMiddleware");
      expect(error.response.body).to.have.property("validationErrors");
      expect(error.response.body.validationErrors).to.have.length(1);
      expect(error.response.body.validationErrors[0]).to.eql("Username is missing");
    }
  });

  it("PUT /api/v1/socobouser/:id should fail if provided email is not valid", async () => {
    const accessToken = await TestHelper.getToken();
    const resultAll = await TestHelper.getAgent().get("/api/v1/socobouser").set("x-access-token", accessToken);
    const id = resultAll.body[0].id;
    const resultBefore = await TestHelper.getAgent().get(`/api/v1/socobouser/${id}`).set("x-access-token", accessToken);

    try {
      const updateRequestBody = {
        fieldsToUpdate: { email: "./tmp.png" },
        updateType: SocoboUserUpdateType.email
      };

      const resultAfter = await TestHelper.getAgent()
        .put(`/api/v1/socobouser/${id}`)
        .set("x-access-token", accessToken)
        .set("Content-Type", "application/json")
        .send(updateRequestBody);

    } catch (error) {
      expect(error.status).to.be.eql(400);
      expect(error.response.body).to.have.property("message", "The provided input is invalid");
      expect(error.response.body).to.have.property("method", "validateObject(..)");
      expect(error.response.body).to.have.property("source", "ModelValidationMiddleware");
      expect(error.response.body).to.have.property("validationErrors");
      expect(error.response.body.validationErrors).to.have.length(1);
      expect(error.response.body.validationErrors[0]).to.have.property("property", "email");
    }
  });

  it("POST /api/v1/socobouser/:id/upload should save a new user image and return the modified user", async () => {
    const id = "59a2ee5be2c06ab513940b84";
    const accessToken = await TestHelper.getToken();
    const resultBefore = await TestHelper.getAgent().get(`/api/v1/socobouser/${id}`).set("x-access-token", accessToken);

    const resultAfter = await TestHelper.getAgent()
      .post(`/api/v1/socobouser/${id}/upload`)
      .set("x-access-token", accessToken)
      .attach("socoboUserImage", readFileSync(`${__dirname}/img/image.jpg`), "image.jpg");

    expect(resultAfter.body.imageUrl).to.not.equal(resultBefore.body.imageUrl);
    expect(resultAfter.body.lastModified).to.not.equal(resultBefore.body.lastModified);
  });

  it("DELETE /api/v1/socobouser/:id should delete the user and return the removed user id", async () => {
    const id = "59a2ee5be2c06ab513940b84";
    const accessToken = await TestHelper.getToken();
    const resultDelete = await TestHelper.getAgent().del(`/api/v1/socobouser/${id}`).set("x-access-token", accessToken);

    expect(resultDelete.body.id).to.equal(id);
  });
});
