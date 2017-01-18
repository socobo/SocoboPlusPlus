import * as mocha from "mocha";
import * as chai from "chai"; 
import * as sinon from "sinon";
import { Request, Response, NextFunction } from "express";
import * as express from "express";

import { RecipeService, UserService } from "./../src/logic/services/index";
import { RecipeHandler } from "./../src/routes/api/v1/recipes/recipe.handler";
import { ApiError, DbError, Recipe, ERRORS } from "./../src/models/index";
import Server from "./../src/server";

const mocks = require("node-mocks-http");

describe("Recipe Handler", () => {

	let recipeService: RecipeService = new RecipeService(null);
	let userService: UserService = new UserService(null);

	let req: any;
	let res: any;
	let recipeServicestub: sinon.SinonStub;
	let userServiceStub: sinon.SinonStub;

	beforeEach(() => {
		res = mocks.createResponse({
			eventEmitter: require("events").EventEmitter
		});
		let recipe: Recipe = new Recipe();
			recipe.title = "Test Recipe";
			req = mocks.createRequest({
				body: recipe,
				params: {
          id: 42
        }
		});
	});

	afterEach(() => {
		recipeServicestub.restore();
	});
	
	it("getById should send a response with the recipe returned by the recipeService", (done) => {
			
		recipeServicestub = sinon.stub(recipeService, "getById").returns(Promise.resolve("recipe"));

		let recipeHandler = new RecipeHandler(recipeService, userService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			var data = JSON.parse( res._getData() );
			chai.expect(data).to.be.equal("recipe");
			done();
    });
	});

	it("getById should send a json response", (done) => {

		recipeServicestub = sinon.stub(recipeService, "getById").returns(Promise.resolve("recipe"));

		let recipeHandler = new RecipeHandler(recipeService, userService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			chai.expect(res._isJSON()).to.be.true;
			done();
    });
	});

	it("getById should return 200 OK if recipe was found", (done) => {

		recipeServicestub = sinon.stub(recipeService, "getById").returns(Promise.resolve("recipe"));

		let recipeHandler = new RecipeHandler(recipeService, userService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			chai.expect(res.statusCode).to.be.equal(200);
			done();
    });
	});

	it("getById should return 500 Internal Server Error if any error other than 404 was thrown", (done) => {

		let dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR);
		recipeServicestub = sinon.stub(recipeService, "getById").returns(Promise.reject(dbError));

		let recipeHandler = new RecipeHandler(recipeService, userService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			chai.expect(res.statusCode).to.be.equal(500);
			done();
    });
	});

	it("getById should return correct error response if a 500 Internal Server Error occurs", (done) => {

		let dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
			.addSource("RecipeService")
			.addSourceMethod("getById()");
		recipeServicestub = sinon.stub(recipeService, "getById").returns(Promise.reject(dbError));

		let recipeHandler = new RecipeHandler(recipeService, userService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			var data = JSON.parse( res._getData() );
			chai.expect(data).to.be.deep.equal(
				{
					"message": "Internal server error",
					"source": "RecipeService",
					"method": "getById()"
				}
			);
			done();
    });
	});

	it("getById should return 404 Not Found Error if the resource was not found", (done) => {

		let dbError = new DbError(ERRORS.RECIPE_NOT_FOUND);
		recipeServicestub = sinon.stub(recipeService, "getById").returns(Promise.reject(dbError));

		let recipeHandler = new RecipeHandler(recipeService, userService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			chai.expect(res.statusCode).to.be.equal(404);
			done();
    });
	});

	it("getById should return correct error response on 404 Not Found", (done) => {

		let dbError = new DbError(ERRORS.RECIPE_NOT_FOUND.withArgs("id", "42"))
			.addSource("RecipeService")
			.addSourceMethod("getById()");
		recipeServicestub = sinon.stub(recipeService, "getById").returns(Promise.reject(dbError));

		let recipeHandler = new RecipeHandler(recipeService, userService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			var data = JSON.parse( res._getData() );

				chai.expect(data).to.be.deep.equal(
					{
						"message": "Recipe with id 42 could not be found",
						"source": "RecipeService",
						"method": "getById()"
					}
				);
				done();
    });
	});

	it("save should send a response with the recipe exptended by the assigned id", (done) => {
		
		recipeServicestub = sinon.stub(recipeService, "save").returns(Promise.resolve({id: 1}));
		userServiceStub = sinon.stub(userService, "getUserById").returns(Promise.resolve());

		let recipeHandler = new RecipeHandler(recipeService, userService);
		recipeHandler.save(req, res);
		
		res.on("end", function() {
			var data = JSON.parse( res._getData() );
			
			let recipe: Recipe = new Recipe();
			recipe.title = "Test Recipe";
			recipe.id = 1;
			chai.expect(data.title).to.be.equal("Test Recipe");
			chai.expect(data.id).to.be.equal(1);
			userServiceStub.restore();
			done();
    });
	});

	it("save should set a creation data to the recipe", (done) => {
		
		recipeServicestub = sinon.stub(recipeService, "save").returns(Promise.resolve({id: 1}));
		userServiceStub = sinon.stub(userService, "getUserById").returns(Promise.resolve());

		let recipeHandler = new RecipeHandler(recipeService, userService);
		recipeHandler.save(req, res);
		
		res.on("end", function() {
			var data = JSON.parse( res._getData() );
			
			let recipe: Recipe = new Recipe();
			recipe.title = "Test Recipe";
			recipe.id = 1
			chai.expect(data.created).to.not.be.null;
			chai.expect(data.created).to.not.be.undefined;
			chai.expect(data.created).to.have.length.above(1);
			userServiceStub.restore();
			done();
    });
	});

	it("save should send a json response", (done) => {
		
		recipeServicestub = sinon.stub(recipeService, "save").returns(Promise.resolve({id: 1}));
		userServiceStub = sinon.stub(userService, "getUserById").returns(Promise.resolve());

		let recipeHandler = new RecipeHandler(recipeService, userService);
		recipeHandler.save(req, res);
		
		res.on("end", function() {
			chai.expect(res._isJSON()).to.be.true;
			userServiceStub.restore();
			done();
    });
	});

	it("save should return 201 CREATED if the creation was successful", (done) => {
		
		recipeServicestub = sinon.stub(recipeService, "save").returns(Promise.resolve({id: 1}));
		userServiceStub = sinon.stub(userService, "getUserById").returns(Promise.resolve());

		let recipeHandler = new RecipeHandler(recipeService, userService);
		recipeHandler.save(req, res);
		
		res.on("end", function() {
			chai.expect(res.statusCode).to.be.equal(201);
			userServiceStub.restore();
			done();
    });
	});

	it("save should return 500 Internal Server Error if the creation failes", (done) => {

		let dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR);
		recipeServicestub = sinon.stub(recipeService, "save").returns(Promise.reject(dbError));
		userServiceStub = sinon.stub(userService, "getUserById").returns(Promise.resolve());

		let recipeHandler = new RecipeHandler(recipeService, userService);
		recipeHandler.save(req, res);
		
		res.on("end", function() {
			chai.expect(res.statusCode).to.be.equal(500);
			userServiceStub.restore();
			done();
    });
	});

	it("save should return correct error response if a 500 Internal server error occurs", (done) => {

		let dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
			.addSource("RecipeService")
			.addSourceMethod("save()");
		recipeServicestub = sinon.stub(recipeService, "save").returns(Promise.reject(dbError));
		userServiceStub = sinon.stub(userService, "getUserById").returns(Promise.resolve());

		let recipeHandler = new RecipeHandler(recipeService, userService);
		recipeHandler.save(req, res);

		res.on("end", function() {
			var data = JSON.parse( res._getData() );
			chai.expect(data).to.be.deep.equal(
				{
					"message": "Internal server error",
					"source": "RecipeService",
					"method": "save()"
				}
			);
			userServiceStub.restore();
			done();
		});
	});
});