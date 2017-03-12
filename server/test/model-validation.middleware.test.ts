process.env.NODE_ENV = "test";

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { NextFunction, Request, Response, Router } from "express";
import * as mocha from "mocha";
import * as sinon from "sinon";
import { ModelValidationMiddleware } from "./../src/logic/middleware/index";
import { Recipe, ValidationGroup } from "./../src/models/index";

chai.use(chaiAsPromised);
chai.should();

describe("Model Validation Middleware", () => {

  const mocks = require("node-mocks-http");

  it("validation of a recipe with empty title and userId failes with two properties", () => {

    let req: any;
    const recipe: Recipe = new Recipe();
    recipe.title = "";

    req = mocks.createRequest({
      body: recipe
    });

    const prom: any = new ModelValidationMiddleware().validate(Recipe, req, [ValidationGroup.RECIPE]);
    return prom.should.be.rejected.then((e: any) => {
      e.should.to.have.deep.property("validationErrors").to.have.deep.lengthOf(2);
    });
  });

  it("validation of a recipe with empty title and userId failes with the properties title and userId", () => {

    let req: any;
    const recipe: Recipe = new Recipe();
    recipe.title = "";

    req = mocks.createRequest({
      body: recipe
    });

    const prom: any = new ModelValidationMiddleware().validate(Recipe, req, [ValidationGroup.RECIPE]);
    return prom.should.be.rejected.then((e: any) => {
      e.should.to.have.deep.property("validationErrors[0].property", "title");
      e.should.to.have.deep.property("validationErrors[1].property", "userId");
    });
  });

  it("validation of a recipe rejected with correct validation error values", () => {

    let req: any;
    const recipe: Recipe = new Recipe();
    recipe.title = "";

    req = mocks.createRequest({
      body: recipe
    });

    const prom: any = new ModelValidationMiddleware().validate(Recipe, req, [ValidationGroup.RECIPE]);
    return prom.should.be.rejected.then((e: any) => {
      e.should.to.have.deep.property("message", "The provided input is invalid");
      e.should.to.have.deep.property("sourceMethod", "validate(..)");
      e.should.to.have.deep.property("source", "ModelValidationMiddleware");
    });
  });

  it("validation of a recipe with title and userId will be resolved", () => {

    let req: any;
    const recipe: Recipe = new Recipe();
    recipe.title = "Test Title";
    recipe.userId = 2;

    req = mocks.createRequest({
      body: recipe
    });

    const prom: any = new ModelValidationMiddleware().validate(Recipe, req, [ValidationGroup.RECIPE]);
    return prom.should.be.resolved;
  });
});
