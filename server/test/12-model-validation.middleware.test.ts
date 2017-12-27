process.env["NODE_ENV"] = "test";

import * as chai from "chai";
import { NextFunction, Request, Response, Router } from "express";
import * as mocha from "mocha";
import * as sinon from "sinon";
import { ModelValidationMiddleware, ValidationGroup } from "./../src/app/index";
import { Recipe } from "./../src/recipe/index";

chai.should();

describe("Model Validation Middleware", () => {

  const expect = chai.expect;
  const mocks = require("node-mocks-http");

  it("validation of a recipe rejected with correct validation error values", async () => {

    const recipe: Recipe = new Recipe();
    recipe.title = "";

    const req = mocks.createRequest({
      body: recipe
    });

    try {
      const prom = await new ModelValidationMiddleware().validateObject(new Recipe(), req, [ValidationGroup.RECIPE]);
    } catch (error) {
      expect(error).to.have.deep.property("statusCode", 400);
      expect(error).to.have.deep.property("message", "The provided input is invalid");
      expect(error).to.have.deep.property("sourceMethod", "validateObject(..)");
      expect(error).to.have.deep.property("source", "ModelValidationMiddleware");
    }
  });

  it("validation of a recipe with empty title and userId failes with the properties title and userId", async () => {

    const recipe: Recipe = new Recipe();
    recipe.title = "";

    const req = mocks.createRequest({
      body: recipe
    });

    try {
      const prom = await new ModelValidationMiddleware().validateObject(new Recipe(), req, [ValidationGroup.RECIPE]);
    } catch (error) {
      expect(error).to.have.deep.property("validationErrors");
      expect(error.validationErrors).to.have.length(2);
      expect(error.validationErrors[0]).to.have.deep.property("property", "title");
      expect(error.validationErrors[1]).to.have.deep.property("property", "userId");
    }
  });

  it("validation of a recipe with title and userId will be resolved", async () => {

    const recipe: Recipe = new Recipe();
    recipe.title = "Test Title";
    recipe.userId = "2";
    recipe.steps = [];

    const req = mocks.createRequest({
      body: recipe
    });

    const result = await new ModelValidationMiddleware().validateObject(new Recipe(), req, [ValidationGroup.RECIPE]);
    expect(result).to.be.undefined;
  });
});
