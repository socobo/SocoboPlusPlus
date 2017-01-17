import * as mocha from "mocha";
import * as chai from "chai"; 
import * as sinon from "sinon";
import {Router, Request, Response, NextFunction } from "express";

import { ApiValidator } from "./../src/logic/middleware/index";
import { Recipe, ValidationError } from "./../src/models/index";

let mocks = require("node-mocks-http");
require("mocha-as-promised")();
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

describe('ApiValidator', function(){

	it('validation of a recipe with empty title and userId failes with two properties', function(){

		let req: any;
		let res: any;
		let recipe: Recipe = new Recipe();
		recipe.title = "";
		req = mocks.createRequest({
			body: recipe
		});

		let prom: any = new ApiValidator().validate(Recipe,req);
		return prom.should.eventually.have.deep.property('validationErrors').to.have.lengthOf(2);
	})

	it('validation of a recipe with empty title and userId failes with the properties title and userId', function(){

		let req: any;
		let res: any;
		let recipe: Recipe = new Recipe();
		recipe.title = "";
		req = mocks.createRequest({
			body: recipe
		});

		let prom: any = new ApiValidator().validate(Recipe,req);
		return Promise.all([
			prom.should.eventually.have.deep.property('validationErrors[0].property', 'title'),
			prom.should.eventually.have.deep.property('validationErrors[1].property', 'userId')]);
	});

	it('validation of a recipe resolves with correct validation error values', function(){

		let req: any;
		let res: any;
		let recipe: Recipe = new Recipe();
			recipe.title = ""
			req = mocks.createRequest({
				body: recipe
		});

		let prom: any = new ApiValidator().validate(Recipe,req);
		return Promise.all([
			prom.should.eventually.have.property('message', 'The provided input is invalid'),
			prom.should.eventually.have.property('sourceMethod', 'validate(..)'),
			prom.should.eventually.have.property('source', 'ApiValidator')]);
	});

	it('validation of a recipe with title and userId will be rejected', function(){

		let req: any;
		let res: any;
		let recipe: Recipe = new Recipe();
		recipe.title = "Test Title";
		recipe.userId = 2;
		req = mocks.createRequest({
			body: recipe
		});

		let prom: any = new ApiValidator().validate(Recipe,req);
		return prom.should.be.rejected;
	});
});