/* tslint:disable:no-var-requires */
process.env.NODE_ENV = "test";

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { NextFunction, Request, Response, Router } from "express";
import * as mocha from "mocha";
import * as sinon from "sinon";
import { ApiValidator } from "./../src/logic/middleware/index";
import { Recipe, ValidationError } from "./../src/models/index";

chai.use(chaiAsPromised);
chai.should();

describe("ApiValidator", () => {

  const mocks = require("node-mocks-http");

  it("validation of a recipe with empty title and userId failes with two properties", () => {

    let req: any;
    const recipe: Recipe = new Recipe();
    recipe.title = "";

    req = mocks.createRequest({
      body: recipe
    });

    const prom: any = new ApiValidator().validate(Recipe, req);
    return prom.should.eventually.have.deep.property("validationErrors").to.have.lengthOf(2);
  });

  it("validation of a recipe with empty title and userId failes with the properties title and userId", () => {

    let req: any;
    const recipe: Recipe = new Recipe();
    recipe.title = "";

    req = mocks.createRequest({
      body: recipe
    });

    const prom: any = new ApiValidator().validate(Recipe, req);
    return Promise.all([
      prom.should.eventually.have.deep.property("validationErrors[0].property", "title"),
      prom.should.eventually.have.deep.property("validationErrors[1].property", "userId")]);
  });

  it("validation of a recipe resolves with correct validation error values", () => {

    let req: any;
    const recipe: Recipe = new Recipe();
    recipe.title = "";

    req = mocks.createRequest({
      body: recipe
    });

    const prom: any = new ApiValidator().validate(Recipe, req);
    return Promise.all([
      prom.should.eventually.have.property("message", "The provided input is invalid"),
      prom.should.eventually.have.property("sourceMethod", "validate(..)"),
      prom.should.eventually.have.property("source", "ApiValidator")]);
  });

  it("validation of a recipe with title and userId will be rejected", () => {

    let req: any;
    const recipe: Recipe = new Recipe();
    recipe.title = "Test Title";
    recipe.userId = 2;

    req = mocks.createRequest({
      body: recipe
    });

    const prom: any = new ApiValidator().validate(Recipe, req);
    return prom.should.be.rejected;
  });
});
/* tslint:enable:no-var-requires */
