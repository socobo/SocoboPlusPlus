process.env.NODE_ENV = "test";

import * as chai from "chai";
import * as express from "express";
import * as mocha from "mocha";
import * as sinon from "sinon";
import { RecipeRepository, RecipeHandler, Recipe } from "./../src/recipe/index";
import { SocoboUserRepository } from "./../src/socobouser/index";
import { ApiError, DbError, ERRORS,  } from "./../src/app/index";
import Server from "./../src/server";

describe("Recipe Handler", () => {

  const mocks = require("node-mocks-http");

  const recipeRepository: RecipeRepository = new RecipeRepository(null);
  const socobouserRepository: SocoboUserRepository = new SocoboUserRepository(null);
  const db = {
    recipes: recipeRepository,
    socobousers: socobouserRepository
  };

  let req: any;
  let res: any;
  let recipeRepositorystub: sinon.SinonStub;
  let socobouserRepositoryStub: sinon.SinonStub;

  beforeEach(() => {
    res = mocks.createResponse({
      eventEmitter: require("events").EventEmitter
    });

    const recipe: Recipe = new Recipe();
    recipe.title = "Test Recipe";

    req = mocks.createRequest({
      body: recipe,
      params: {
        id: 42
      }
    });
  });

  afterEach(() => {
    recipeRepositorystub.restore();
  });

  it("getById should send a response with the recipe returned by the RecipeRepository", (done) => {

    recipeRepositorystub = sinon.stub(recipeRepository, "getById").returns(Promise.resolve("recipe"));

    const recipeHandler = new RecipeHandler(db, null, null);
    recipeHandler.getById(req, res);

    res.on("end", () => {
      const data = JSON.parse(res._getData());
      chai.expect(data).to.be.equal("recipe");
      done();
    });
  });

  it("getById should send a json response", (done) => {

    recipeRepositorystub = sinon.stub(recipeRepository, "getById").returns(Promise.resolve("recipe"));

    const recipeHandler = new RecipeHandler(db, null, null);
    recipeHandler.getById(req, res);

    res.on("end", () => {
      chai.expect(res._isJSON()).to.be.true;
      done();
    });
  });

  it("getById should return 200 OK if recipe was found", (done) => {

    recipeRepositorystub = sinon.stub(recipeRepository, "getById").returns(Promise.resolve("recipe"));

    const recipeHandler = new RecipeHandler(db, null, null);
    recipeHandler.getById(req, res);

    res.on("end", () => {
      chai.expect(res.statusCode).to.be.equal(200);
      done();
    });
  });

  it("getById should return 500 Internal Server Error if any error other than 404 was thrown", (done) => {

    const dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR);
    recipeRepositorystub = sinon.stub(recipeRepository, "getById").returns(Promise.reject(dbError));

    const recipeHandler = new RecipeHandler(db, null, null);
    recipeHandler.getById(req, res);

    res.on("end", () => {
      chai.expect(res.statusCode).to.be.equal(500);
      done();
    });
  });

  it("getById should return correct error response if a 500 Internal Server Error occurs", (done) => {

    const dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
      .addSource("RecipeRepository")
      .addSourceMethod("getById()");

    recipeRepositorystub = sinon.stub(recipeRepository, "getById").returns(Promise.reject(dbError));

    const recipeHandler = new RecipeHandler(db, null, null);
    recipeHandler.getById(req, res);

    res.on("end", () => {
      const data = JSON.parse(res._getData());
      chai.expect(data).to.be.deep.equal(
        {
          message: "Internal server error",
          method: "getById()",
          source: "RecipeRepository"
        }
      );
      done();
    });
  });

  it("getById should return 404 Not Found Error if the resource was not found", (done) => {

    const dbError = new DbError(ERRORS.RECIPE_NOT_FOUND);
    recipeRepositorystub = sinon.stub(recipeRepository, "getById").returns(Promise.reject(dbError));

    const recipeHandler = new RecipeHandler(db, null, null);
    recipeHandler.getById(req, res);

    res.on("end", () => {
      chai.expect(res.statusCode).to.be.equal(404);
      done();
    });
  });

  it("getById should return correct error response on 404 Not Found", (done) => {

    const dbError = new DbError(ERRORS.RECIPE_NOT_FOUND.withArgs("id", "42"))
      .addSource("RecipeRepository")
      .addSourceMethod("getById()");

    recipeRepositorystub = sinon.stub(recipeRepository, "getById").returns(Promise.reject(dbError));

    const recipeHandler = new RecipeHandler(db, null, null);
    recipeHandler.getById(req, res);

    res.on("end", () => {
      const data = JSON.parse(res._getData());

      chai.expect(data).to.be.deep.equal(
        {
          message: "Recipe with id 42 could not be found",
          method: "getById()",
          source: "RecipeRepository"
        }
      );
      done();
    });
  });

  it("save should send a response with the recipe exptended by the assigned id", (done) => {

    recipeRepositorystub = sinon.stub(recipeRepository, "save").returns(Promise.resolve({ id: 1 }));
    socobouserRepositoryStub = sinon.stub(socobouserRepository, "getUserById").returns(Promise.resolve());

    const recipeHandler = new RecipeHandler(db, null, null);
    recipeHandler.save(req, res);

    res.on("end", () => {
      const data = JSON.parse(res._getData());

      const recipe: Recipe = new Recipe();
      recipe.title = "Test Recipe";
      recipe.id = 1;

      chai.expect(data.title).to.be.equal("Test Recipe");
      chai.expect(data.id).to.be.equal(1);

      socobouserRepositoryStub.restore();
      done();
    });
  });

  it("save should set a creation data to the recipe", (done) => {

    recipeRepositorystub = sinon.stub(recipeRepository, "save").returns(Promise.resolve({ id: 1 }));
    socobouserRepositoryStub = sinon.stub(socobouserRepository, "getUserById").returns(Promise.resolve());

    const recipeHandler = new RecipeHandler(db, null, null);
    recipeHandler.save(req, res);

    res.on("end", () => {
      const data = JSON.parse(res._getData());

      const recipe: Recipe = new Recipe();
      recipe.title = "Test Recipe";
      recipe.id = 1;

      chai.expect(data.created).to.not.be.null;
      chai.expect(data.created).to.not.be.undefined;
      chai.expect(data.created).to.have.length.above(1);

      socobouserRepositoryStub.restore();
      done();
    });
  });

  it("save should send a json response", (done) => {

    recipeRepositorystub = sinon.stub(recipeRepository, "save").returns(Promise.resolve({ id: 1 }));
    socobouserRepositoryStub = sinon.stub(socobouserRepository, "getUserById").returns(Promise.resolve());

    const recipeHandler = new RecipeHandler(db, null, null);
    recipeHandler.save(req, res);

    res.on("end", () => {
      chai.expect(res._isJSON()).to.be.true;

      socobouserRepositoryStub.restore();
      done();
    });
  });

  it("save should return 201 CREATED if the creation was successful", (done) => {

    recipeRepositorystub = sinon.stub(recipeRepository, "save").returns(Promise.resolve({ id: 1 }));
    socobouserRepositoryStub = sinon.stub(socobouserRepository, "getUserById").returns(Promise.resolve());

    const recipeHandler = new RecipeHandler(db, null, null);
    recipeHandler.save(req, res);

    res.on("end", () => {
      chai.expect(res.statusCode).to.be.equal(201);

      socobouserRepositoryStub.restore();
      done();
    });
  });

  it("save should return 500 Internal Server Error if the creation failes", (done) => {

    const dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR);
    recipeRepositorystub = sinon.stub(recipeRepository, "save").returns(Promise.reject(dbError));
    socobouserRepositoryStub = sinon.stub(socobouserRepository, "getUserById").returns(Promise.resolve());

    const recipeHandler = new RecipeHandler(db, null, null);
    recipeHandler.save(req, res);

    res.on("end", () => {
      chai.expect(res.statusCode).to.be.equal(500);

      socobouserRepositoryStub.restore();
      done();
    });
  });

  it("save should return correct error response if a 500 Internal server error occurs", (done) => {

    const dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
      .addSource("RecipeRepository")
      .addSourceMethod("save()");

    recipeRepositorystub = sinon.stub(recipeRepository, "save").returns(Promise.reject(dbError));
    socobouserRepositoryStub = sinon.stub(socobouserRepository, "getUserById").returns(Promise.resolve());

    const recipeHandler = new RecipeHandler(db, null, null);
    recipeHandler.save(req, res);

    res.on("end", () => {
      const data = JSON.parse(res._getData());
      chai.expect(data).to.be.deep.equal(
        {
          message: "Internal server error",
          method: "save()",
          source: "RecipeRepository"
        }
      );

      socobouserRepositoryStub.restore();
      done();
    });
  });
});
