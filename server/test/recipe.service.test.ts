import * as mocha from "mocha";
import * as chai from "chai"; 
import * as sinon from "sinon";
import { IDatabase } from "pg-promise";
import * as pgPromise from "pg-promise";
import { errors } from "pg-promise";

import { ApiValidator } from "./../src/logic/middleware/index";
import { ValidationError, Recipe, DbError, ERRORS } from "./../src/models/index";
import { RecipeService } from "./../src/logic/services/index";

require("mocha-as-promised")();
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

describe("RecipeService", () => {

	let db: IDatabase<any>;
	let stub: sinon.SinonStub;

	beforeEach(() => {
		const pgp: pgPromise.IMain = pgPromise({noLocking:true});
    db = pgp("connectionString");
	});

	afterEach(() => {
		stub.restore();
	});

	it("getById should call the one method of pgPromis with the correct query and parameters", () => {
		stub = sinon.stub(db, "one").returns(Promise.resolve("TEST"));
		let service = new RecipeService(db);
		return service.getById(1).then((value) => {
			chai.expect(stub.calledWith(`select * 
                                from recipes
                                where recipes.id = $1`, [1])).to.be.true;
		});
	});

	it("getById should return promise with 404 error if the recipe was not found", () => {

		let err: any = {
			code: errors.queryResultErrorCode.noData
		};

		let dbError = new DbError(ERRORS.RECIPE_NOT_FOUND.withArgs("id", "1"))
			.addSource("RecipeService")
			.addSourceMethod("getById");
		stub = sinon.stub(db, "one").returns(Promise.reject(err));
		let service = new RecipeService(db);
		return service.getById(1).catch((error) => {
			chai.expect(error).to.have.property("code", "40001");
			chai.expect(error).to.have.property("statusCode", 404);
			chai.expect(error).to.have.property("source", "RecipeService");
			chai.expect(error).to.have.property("sourceMethod", "getById(..)");
		});
	});

	it("getById should return promise with 500 error if the db request fails and is not 404", () => {

		let err: any = {
			code: 1
		};

		let dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
			.addSource("RecipeService")
			.addSourceMethod("getById");
		stub = sinon.stub(db, "one").returns(Promise.reject(err));
		let service = new RecipeService(db);
		return service.getById(1).catch((error) => {
			chai.expect(error).to.have.property("code", "00001");
			chai.expect(error).to.have.property("statusCode", 500);
			chai.expect(error).to.have.property("source", "RecipeService");
			chai.expect(error).to.have.property("sourceMethod", "getById(..)");
		});
	});

	it("save should return a promise with 500 error if a db error occurs", () => {
		let stubTx = sinon.stub(db, "tx");
		stubTx.returns(Promise.reject("TEST"));

		let service = new RecipeService(db);
		let recipe: Recipe = new Recipe();

		return service.save(recipe).catch((error) => {
			chai.expect(error).to.have.property("code", "00001");
			chai.expect(error).to.have.property("statusCode", 500);
			chai.expect(error).to.have.property("source", "RecipeService");
			chai.expect(error).to.have.property("sourceMethod", "save(..)");
		});
	});

	it("save should open a transaction and call the one method of pgPromis with the correct query and parameters", () => {
		let stubTx = sinon.stub(db, "tx");
		stubTx.callsArg(0);
		stubTx.returns(Promise.resolve("TEST"));

		stub = sinon.stub(db, "one").returns(Promise.resolve("TEST"))

		let service = new RecipeService(db);

		let recipe: Recipe = new Recipe();
		recipe.title = "Test";
		recipe.description = "TestDesc";
		recipe.userId = 1;
		recipe.imageUrl = "testUrl";
		let date = new Date("9999");
		recipe.created = date;

		return service.save(recipe).then((value) => {
			chai.expect(stub.calledWith(`insert into recipes(
                             title,
                             userId,
                             description,
                             imageUrl,
                             created)
                           values($1, $2, $3, $4, $5)
                           returning id`, ["Test", 1, "TestDesc", "testUrl", date])).to.be.true;
		});
	});
});