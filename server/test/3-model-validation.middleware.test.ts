process.env["NODE_ENV"] = "test";

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { NextFunction, Request, Response, Router } from "express";
import * as mocha from "mocha";
import * as sinon from "sinon";
import { ModelValidationMiddleware, ValidationGroup } from "./../src/app/index";
import { Recipe } from "./../src/recipe/index";

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

    const prom: any = new ModelValidationMiddleware().validateObject(new Recipe(), req, [ValidationGroup.RECIPE]);
    return prom.should.be.rejected.then((e: any) => {
      e.should.to.have.deep.property("validationErrors").to.have.deep.lengthOf(2);
    });
  });

  // FIXME: AssertionError: expected [ApiError: ... to have property 'validationErrors[0].property'
  // it("validation of a recipe with empty title and userId failes with the properties title and userId", () => {

  //   let req: any;
  //   const recipe: Recipe = new Recipe();
  //   recipe.title = "";

  //   req = mocks.createRequest({
  //     body: recipe
  //   });

  //   const prom: any = new ModelValidationMiddleware().validate(Recipe, req, [ValidationGroup.RECIPE]);
  //   return prom.should.be.rejected.then((e: any) => {
  //     console.log(e);
  //     const valiErrors = e.validationErrors;
  //     console.log(valiErrors);
  //     e.should.to.have.deep.property("validationErrors");
  //     e.should.to.have.deep.property("validationErrors[0].property", "title");
  //     // e.should.to.have.deep.property("validationErrors[1].property", "userId");
  //     // e.should.to.have.deep.property("validationErrors[2].property", "steps");
  //   });
  // });

  it("validation of a recipe rejected with correct validation error values", () => {

    let req: any;
    const recipe: Recipe = new Recipe();
    recipe.title = "";

    req = mocks.createRequest({
      body: recipe
    });

    const prom: any = new ModelValidationMiddleware().validateObject(new Recipe(), req, [ValidationGroup.RECIPE]);
    return prom.should.be.rejected.then((e: any) => {
      e.should.to.have.deep.property("message", "The provided input is invalid");
      e.should.to.have.deep.property("sourceMethod", "validateObject(..)");
      e.should.to.have.deep.property("source", "ModelValidationMiddleware");
    });
  });

  // FIXME: Error: Invalid Chai property: resolved
  // it("validation of a recipe with title and userId will be resolved", () => {

  //   let req: any;
  //   const recipe: Recipe = new Recipe();
  //   recipe.title = "Test Title";
  //   recipe.userId = 2;
  //   recipe.steps = [];

  //   req = mocks.createRequest({
  //     body: recipe
  //   });

  //   const prom: any = new ModelValidationMiddleware().validate(Recipe, req, [ValidationGroup.RECIPE]);
  //   return prom.should.be.resolved;
  // });
});
