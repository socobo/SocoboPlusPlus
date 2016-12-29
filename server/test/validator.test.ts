import * as mocha from "mocha";
import * as chai from "chai"; 
import * as sinon from "sinon";

import {Router, Request, Response, NextFunction } from "express";
import { ApiValidator } from "./../src/middleware/Validator"
import { Recipe } from "./../src/models/Recipe"
import {validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate} from "class-validator"
import {EventEmitter} from 'events';
let mocks = require("node-mocks-http")
require("mocha-as-promised")();
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should()

describe('ApiValidator', function(){

	let req: any;
	let res: any;

		beforeEach(function(){
			let recipe: Recipe = new Recipe();
			recipe.title = ""
			recipe.userId = 2
			req = mocks.createRequest({
				body: recipe
		});
	})

	afterEach(function(){
	})

	it('validation of a recipe with empty title failes', function(){

		let prom: any = new ApiValidator().validate(Recipe,req);
		return prom.should.eventually.have.deep.property('validationErrors[0].property', 'title');
	})

})