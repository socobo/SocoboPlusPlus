process.env["NODE_ENV"] = "test";

import { expect } from "chai";
import * as mocha from "mocha";
import { TestHelper } from "./helper/TestHelper";

describe("AuthRoute - API v1", () => {

  it("POST /api/v1/login as ADMIN w/ EMAIL should create a token and return the user", async () => {
    const user = { email: "admin", password: "password" };
    const result = await TestHelper.getAgent().post("/api/v1/auth/login").send(user);
    expect(result.body).to.have.deep.property("token");
    expect(result.body.token).to.not.null;
    expect(result.body).to.have.deep.property("socobouser");
    expect(result.body.socobouser).to.have.deep.property("id");
    expect(result.body.socobouser).to.have.deep.property("username");
    expect(result.body.socobouser).to.have.deep.property("email");
    expect(result.body.socobouser).to.have.deep.property("hasTermsAccepted");
    expect(result.body.socobouser).to.have.deep.property("role");
    expect(result.body.socobouser).to.have.deep.property("provider");
    expect(result.body.socobouser).to.have.deep.property("imageUrl");
    expect(result.body.socobouser).to.have.deep.property("created");
    expect(result.body.socobouser).to.have.deep.property("lastModified");
  });

  it("POST /api/v1/login as USER w/ EMAIL should create a token and return the user", async () => {
    const user = { email: "john-doe@test.test", password: "SuperSecurePassword" };
    const result = await TestHelper.getAgent().post("/api/v1/auth/login").send(user);
    expect(result.body).to.have.deep.property("token");
    expect(result.body.token).to.not.null;
    expect(result.body).to.have.deep.property("socobouser");
    expect(result.body.socobouser).to.have.deep.property("id");
    expect(result.body.socobouser).to.have.deep.property("username");
    expect(result.body.socobouser).to.have.deep.property("email");
    expect(result.body.socobouser).to.have.deep.property("hasTermsAccepted");
    expect(result.body.socobouser).to.have.deep.property("role");
    expect(result.body.socobouser).to.have.deep.property("provider");
    expect(result.body.socobouser).to.have.deep.property("imageUrl");
    expect(result.body.socobouser).to.have.deep.property("created");
    expect(result.body.socobouser).to.have.deep.property("lastModified");
  });

  it("POST /api/v1/login w/ EMAIL should fail if the user is unknown", async () => {
    try {
      const user = { email: "peter672@test.test", password: "hallo122334" };
      const result = await TestHelper.getAgent().post("/api/v1/auth/login").send(user);
    } catch (error) {
      expect(error.status).to.be.eql(404);
      expect(error.response.body).to.have.property("message", "User with identifier peter672@test.test could not be found");
      expect(error.response.body).to.have.property("method", "_transformResult()");
      expect(error.response.body).to.have.property("source", "SocoboUserRepository");
    }
  });

  it("POST /api/v1/login w/ EMAIL should fail if the users password is wrong", async () => {
    try {
      const user = { email: "john-doe@test.test", password: "hallo122334" };
      const result = await TestHelper.getAgent().post("/api/v1/auth/login").send(user);
    } catch (error) {
      expect(error.status).to.be.eql(401);
      expect(error.response.body).to.have.property("message", "Authentication failed. Wrong password");
      expect(error.response.body).to.have.property("method", "comparePasswords(..)");
      expect(error.response.body).to.have.property("source", "CryptoUtils");
    }
  });

  it("POST /api/v1/login w/ EMAIL should fail if the users email is wrong", async () => {
    try {
      const user = { email: "johndoeX@test.test", password: "SuperSecurePassword" };
      const result = await TestHelper.getAgent().post("/api/v1/auth/login").send(user);
    } catch (error) {
      expect(error.status).to.be.eql(404);
      expect(error.response.body).to.have.property("message", "User with identifier johndoeX@test.test could not be found");
      expect(error.response.body).to.have.property("method", "_transformResult()");
      expect(error.response.body).to.have.property("source", "SocoboUserRepository");
    }
  });

  it("POST /api/v1/login w/ USERNAME should fail if the user is unknown", async () => {
    try {
      const user = { username: "hans", password: "hallo122334" };
      const result = await TestHelper.getAgent().post("/api/v1/auth/login").send(user);
    } catch (error) {
      expect(error.status).to.be.eql(404);
      expect(error.response.body).to.have.property("message", "User with identifier hans could not be found");
      expect(error.response.body).to.have.property("method", "_transformResult()");
      expect(error.response.body).to.have.property("source", "SocoboUserRepository");
    }
  });

  it("POST /api/v1/login w/ USERNAME should fail if the users password is wrong", async () => {
    try {
      const user = { username: "admin", password: "hallo122334" };
      const result = await TestHelper.getAgent().post("/api/v1/auth/login").send(user);
    } catch (error) {
      expect(error.status).to.be.eql(401);
      expect(error.response.body).to.have.property("message", "Authentication failed. Wrong password");
      expect(error.response.body).to.have.property("method", "comparePasswords(..)");
      expect(error.response.body).to.have.property("source", "CryptoUtils");
    }
  });

  it("POST /api/v1/login w/ USERNAME should fail if the users username is wrong", async () => {
    try {
      const user = { username: "adminZZZ", password: "password" };
      const result = await TestHelper.getAgent().post("/api/v1/auth/login").send(user);
    } catch (error) {
      expect(error.status).to.be.eql(404);
      expect(error.response.body).to.have.property("message", "User with identifier adminZZZ could not be found");
      expect(error.response.body).to.have.property("method", "_transformResult()");
      expect(error.response.body).to.have.property("source", "SocoboUserRepository");
    }
  });

  it("POST /api/v1/register as ADMIN should create and return the user", async () => {
    const user = { email: "adminXYZ@test.test", password: "password", role: "ADMIN" };
    const result = await TestHelper.getAgent().post("/api/v1/auth/register").send(user);
    expect(result.body).to.have.deep.property("id");
    expect(result.body).to.have.deep.property("username");
    expect(result.body).to.have.deep.property("email");
    expect(result.body).to.have.deep.property("hasTermsAccepted");
    expect(result.body).to.have.deep.property("role");
    expect(result.body).to.have.deep.property("provider");
    expect(result.body).to.have.deep.property("imageUrl");
    expect(result.body).to.have.deep.property("created");
    expect(result.body).to.have.deep.property("lastModified");
  });

  it("POST /api/v1/register as USER should create and return the user", async () => {
    const user = { email: "user2@test.test", password: "password", role: "USER" };
    const result = await TestHelper.getAgent().post("/api/v1/auth/register").send(user);
    expect(result.body).to.have.deep.property("id");
    expect(result.body).to.have.deep.property("username");
    expect(result.body).to.have.deep.property("email");
    expect(result.body).to.have.deep.property("hasTermsAccepted");
    expect(result.body).to.have.deep.property("role");
    expect(result.body).to.have.deep.property("provider");
    expect(result.body).to.have.deep.property("imageUrl");
    expect(result.body).to.have.deep.property("created");
    expect(result.body).to.have.deep.property("lastModified");
  });

  it("POST /api/v1/register should fail if no role is provided", async () => {
    try {
      const user = { email: "user4321@test.test", password: "password" };
      const result = await TestHelper.getAgent().post("/api/v1/auth/register").send(user);
    } catch (error) {
      expect(error.status).to.be.eql(400);
      expect(error.response.body).to.have.deep.property("message", "The provided input is invalid");
      expect(error.response.body).to.have.deep.property("method", "validateObject(..)");
      expect(error.response.body).to.have.deep.property("source", "ModelValidationMiddleware");
      expect(error.response.body).to.have.deep.property("validationErrors");
      expect(error.response.body.validationErrors).to.have.length(1);
      expect(error.response.body.validationErrors[0]).to.have.deep.property("property", "role");
    }
  });

  it("POST /api/v1/register should fail if provided email is not a valid email address", async () => {
    try {
      const user = { email: "admin", password: "password", role: "ADMIN" };
      const result = await TestHelper.getAgent().post("/api/v1/auth/register").send(user);
    } catch (error) {
      expect(error.status).to.be.eql(400);
      expect(error.response.body).to.have.deep.property("message", "The provided input is invalid");
      expect(error.response.body).to.have.deep.property("method", "validateObject(..)");
      expect(error.response.body).to.have.deep.property("source", "ModelValidationMiddleware");
      expect(error.response.body).to.have.deep.property("validationErrors");
      expect(error.response.body.validationErrors).to.have.length(1);
      expect(error.response.body.validationErrors[0]).to.have.deep.property("property", "email");
    }
  });

  it("POST /api/v1/register should fail if user is already registered", async () => {
    try {
      const user = { email: "admin2@test.test", password: "password", role: "ADMIN" };
      const result = await TestHelper.getAgent().post("/api/v1/auth/register").send(user);
    } catch (error) {
      expect(error.status).to.be.eql(400);
      const body = error.response.body;
      expect(body).to.have.deep.property("message", "Email or Username is already registered. Please use another one.");
      expect(body).to.have.deep.property("method", "register(..)");
      expect(body).to.have.deep.property("source", "AuthService");
    }
  });
});
