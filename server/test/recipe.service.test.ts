process.env.NODE_ENV = "test";

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as mocha from "mocha";
import * as pgPromise from "pg-promise";
import * as sinon from "sinon";
import { ApiValidator } from "./../src/logic/middleware/index";
import { RecipeService } from "./../src/logic/services/index";
import { DbError, ERRORS, Recipe, ValidationError } from "./../src/models/index";

chai.use(chaiAsPromised);
chai.should();

describe("RecipeService", () => {

  let db: pgPromise.IDatabase<any>;
  let stub: sinon.SinonStub;

  beforeEach(() => {
    const pgp: pgPromise.IMain = pgPromise({ noLocking: true });
    db = pgp("connectionString");
  });

  afterEach(() => {
    stub.restore();
  });

  it("getById should call the one method of pgPromis with the correct query and parameters", () => {
    stub = sinon.stub(db, "one").returns(Promise.resolve("TEST"));

    const service = new RecipeService(db);
    return service.getById(1).then((value) => {
      chai.expect(stub.calledWith(`select * 
                                from recipes
                                where recipes.id = $1`, [1])).to.be.true;
    });
  });

  it("getById should return promise with 404 error if the recipe was not found", () => {

    const err: any = {
      code: pgPromise.errors.queryResultErrorCode.noData
    };

    const dbError = new DbError(ERRORS.RECIPE_NOT_FOUND.withArgs("id", "1"))
      .addSource("RecipeService")
      .addSourceMethod("getById");
    stub = sinon.stub(db, "one").returns(Promise.reject(err));

    const service = new RecipeService(db);
    return service.getById(1).catch((error) => {
      chai.expect(error).to.have.property("code", "40001");
      chai.expect(error).to.have.property("statusCode", 404);
      chai.expect(error).to.have.property("source", "RecipeService");
      chai.expect(error).to.have.property("sourceMethod", "getById(..)");
    });
  });

  it("getById should return promise with 500 error if the db request fails and is not 404", () => {

    const err: any = {
      code: 1
    };

    const dbError = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
      .addSource("RecipeService")
      .addSourceMethod("getById");
    stub = sinon.stub(db, "one").returns(Promise.reject(err));

    const service = new RecipeService(db);
    return service.getById(1).catch((error) => {
      chai.expect(error).to.have.property("code", "00001");
      chai.expect(error).to.have.property("statusCode", 500);
      chai.expect(error).to.have.property("source", "RecipeService");
      chai.expect(error).to.have.property("sourceMethod", "getById(..)");
    });
  });

  it("save should return a promise with 500 error if a db error occurs", () => {
    const stubTx = sinon.stub(db, "tx");
    stubTx.returns(Promise.reject("TEST"));

    const service = new RecipeService(db);
    const recipe: Recipe = new Recipe();

    return service.save(recipe).catch((error) => {
      chai.expect(error).to.have.property("code", "00001");
      chai.expect(error).to.have.property("statusCode", 500);
      chai.expect(error).to.have.property("source", "RecipeService");
      chai.expect(error).to.have.property("sourceMethod", "save(..)");
    });
  });

  it(`save should open a transaction and call the one method 
      of pgPromise with the correct query and parameters`, () => {

    const stubTx = sinon.stub(db, "tx");
    stubTx.callsArg(1);
    stubTx.returns(Promise.resolve("TEST"));

    stub = sinon.stub(db, "one").returns(Promise.resolve("TEST"));

    const service = new RecipeService(db);

    const recipe: Recipe = new Recipe();
    recipe.title = "Test";
    recipe.userId = 1;
    recipe.description = "TestDesc";
    recipe.imageUrl = "testUrl";
    const date = new Date("9999");
    recipe.created = date;

    const _SAVE: string = `insert into recipes(
                             title, userId, description,
                             imageUrl, created)
                           values($1, $2, $3, $4, $5)
                           returning id`;

    return service.save(recipe).then((value) => {

      chai.expect(stub.calledWith(_SAVE, ["Test", 1, "TestDesc", "testUrl", date])).to.be.true;
    });
  });
});
