import * as mocha from "mocha";
import * as chai from "chai"; 
import * as sinon from "sinon";
import { IDatabase } from "pg-promise";
import * as pgPromise from "pg-promise";

import { ApiValidator } from "./../src/logic/middleware/index";
import { ValidationError, Recipe } from "./../src/models/index";
import { RecipeService } from "./../src/logic/services/index";

require("mocha-as-promised")();
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should()

describe("RecipeService", () => {

	let db: IDatabase<any>;
	let stub: sinon.SinonStub;

	beforeEach(() => {
		const pgp: pgPromise.IMain = pgPromise({noLocking:true});
    db = pgp("connectionString");
	})

	afterEach(() => {
		stub.restore();
	})

	it("getById should call the one method of pgPromis with the correct query and parameters", () => {
		stub = sinon.stub(db, "one").returns(Promise.resolve("TEST"))
		let service = new RecipeService(db);
		return service.getById(1).then((value) => {
			chai.expect(stub.calledWith(`select * 
                                from recipes
                                where recipes.id = $1`, [1])).to.be.true;
		})
	})

	it("save should open a transaction and call the one method of pgPromis with the correct query and parameters", () => {
		let stubTx = sinon.stub(db, "tx");
		stubTx.callsArg(0);
		stubTx.returns(Promise.resolve("TEST"));

		stub = sinon.stub(db, "one").returns(Promise.resolve("TEST"))

		let service = new RecipeService(db);

		let recipe: Recipe = new Recipe()
		recipe.title = "Test";
		recipe.description = "TestDesc";
		recipe.userId = 1;
		recipe.imageUrl = "testUrl";
		let date = new Date("9999")
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
		})
	})
})