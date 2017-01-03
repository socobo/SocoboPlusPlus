import * as mocha from "mocha";
import * as chai from "chai"; 
import * as sinon from "sinon";
import { Request, Response, NextFunction } from "express";
import * as express from "express";
import { errors } from "pg-promise";

import { Recipe } from "./../src/models/Recipe"
import { RecipeService } from "./../src/logic/services/recipe.service"
import { RecipeHandler } from "./../src/routes/api/v1/recipes/recipe.handler"
import { ApiError } from "./../src/models/api-error";
import Server from "./../src/server";

let mocks = require("node-mocks-http")

describe("Recipe Handler", () => {

	let recipeService: RecipeService = new RecipeService(null);

	let req: any;
	let res: any;
	let getByIdStub: sinon.SinonStub;

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
	})

	afterEach(() => {
		getByIdStub.restore();
	})
	
	it("getById should send a response with the recipe returned by the recipeService", (done) => {
			
		getByIdStub = sinon.stub(recipeService, "getById").returns(Promise.resolve("recipe"));

		let recipeHandler = new RecipeHandler(recipeService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			var data = JSON.parse( res._getData() );
			chai.expect(data).to.be.equal("recipe");
			done();
    });
	});

	it("getById should send a json response", (done) => {

		getByIdStub = sinon.stub(recipeService, "getById").returns(Promise.resolve("recipe"));

		let recipeHandler = new RecipeHandler(recipeService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			chai.expect(res._isJSON()).to.be.true;
			done();
    });
	});

	it("getById should return 200 OK if recipe was found", (done) => {

		getByIdStub = sinon.stub(recipeService, "getById").returns(Promise.resolve("recipe"));

		let recipeHandler = new RecipeHandler(recipeService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			chai.expect(res.statusCode).to.be.equal(200);
			done();
    });
	});

	it("getById should return 500 Internal Server Error if any error other than 404 was thrown", (done) => {

		getByIdStub = sinon.stub(recipeService, "getById").returns(Promise.reject(new Error("TestError")));

		let recipeHandler = new RecipeHandler(recipeService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			chai.expect(res.statusCode).to.be.equal(500);
			done();
    });
	});

	it("getById should return correct error response on 500 Internal Server Error", (done) => {

		getByIdStub = sinon.stub(recipeService, "getById").returns(Promise.reject(new Error("TestError")));

		let recipeHandler = new RecipeHandler(recipeService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			var data = JSON.parse( res._getData() );
			chai.expect(data).to.be.deep.equal(
				{
					"message": "Error during adding the new recipe",
					"source": "RecipeService",
					"method": "getById()"
				}
			);
			done();
    });
	});

	it("getById should return 404 Not Found Error if the resource was not found", (done) => {

		let err: any = {
			code: errors.queryResultErrorCode.noData
		}
		getByIdStub = sinon.stub(recipeService, "getById").returns(Promise.reject(err));

		let recipeHandler = new RecipeHandler(recipeService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			chai.expect(res.statusCode).to.be.equal(404);
			done();
    });
	});

	it("getById should return correct error response on 404 Not Found", (done) => {

		let err: any = {
			code: errors.queryResultErrorCode.noData
		}
		getByIdStub = sinon.stub(recipeService, "getById").returns(Promise.reject(err));

		let recipeHandler = new RecipeHandler(recipeService);
		recipeHandler.getById(req, res);
		
		res.on("end", function() {
			var data = JSON.parse( res._getData() );

				chai.expect(data).to.be.deep.equal(
					{
						"message": "The recipe for the id 42 does not exist",
						"source": "RecipeService",
						"method": "getById()"
					}
				);
				done();
    });
	});

	it("save should send a response with the recipe exptended by the assigned id", (done) => {
		
		getByIdStub = sinon.stub(recipeService, "save").returns(Promise.resolve({id: 1}));

		let recipeHandler = new RecipeHandler(recipeService);
		recipeHandler.save(req, res);
		
		res.on("end", function() {
			var data = JSON.parse( res._getData() );
			
			let recipe: Recipe = new Recipe();
			recipe.title = "Test Recipe";
			recipe.id = 1
			chai.expect(data.title).to.be.equal("Test Recipe");
			chai.expect(data.id).to.be.equal(1);
			done();
    });
	});

	it("save should set a creation data to the recipe", (done) => {
		
		getByIdStub = sinon.stub(recipeService, "save").returns(Promise.resolve({id: 1}));

		let recipeHandler = new RecipeHandler(recipeService);
		recipeHandler.save(req, res);
		
		res.on("end", function() {
			var data = JSON.parse( res._getData() );
			
			let recipe: Recipe = new Recipe();
			recipe.title = "Test Recipe";
			recipe.id = 1
			chai.expect(data.created).to.not.be.null;
			chai.expect(data.created).to.not.be.undefined;
			chai.expect(data.created).to.have.length.above(1)
			done();
    });
	});

	it("save should send a json response", (done) => {
		
		getByIdStub = sinon.stub(recipeService, "save").returns(Promise.resolve({id: 1}));

		let recipeHandler = new RecipeHandler(recipeService);
		recipeHandler.save(req, res);
		
		res.on("end", function() {
			chai.expect(res._isJSON()).to.be.true;
			done();
    });
	});

	it("save should return 200 OK if it was successful", (done) => {
		
		getByIdStub = sinon.stub(recipeService, "save").returns(Promise.resolve({id: 1}));

		let recipeHandler = new RecipeHandler(recipeService);
		recipeHandler.save(req, res);
		
		res.on("end", function() {
			chai.expect(res.statusCode).to.be.equal(200);
			done();
    });
	});

	it("save should return 500 Internal Server Error if the resource was not found", (done) => {

		getByIdStub = sinon.stub(recipeService, "save").returns(Promise.reject("TestError"));

		let recipeHandler = new RecipeHandler(recipeService);
		recipeHandler.save(req, res);
		
		res.on("end", function() {
			chai.expect(res.statusCode).to.be.equal(500);
			done();
    });
	});

	it("save should return correct error response on 500 Not Found", (done) => {

		getByIdStub = sinon.stub(recipeService, "save").returns(Promise.reject("TestError"));

		let recipeHandler = new RecipeHandler(recipeService);
		recipeHandler.save(req, res);

		res.on("end", function() {
			var data = JSON.parse( res._getData() );
			chai.expect(data).to.be.deep.equal(
				{
					"message": "Error during adding the new recipe",
					"source": "RecipeService",
					"method": "save()"
				}
			);
			done();
		});
	});
});