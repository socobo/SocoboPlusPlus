import { SocoboUserRoleType } from "./../src/socobouser/enums/SocoboUserRoleType";
/*tslint:disable:no-unused-expression*/

process.env["NODE_ENV"] = "test";

import { expect } from "chai";
import * as mocha from "mocha";
import { TestHelper } from "./helper/TestHelper";

describe("RecipeIngredientRoute - API v1", () => {

  it("GET /api/v1/recipeingredient should pass if a token is provided", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .get("/api/v1/recipeingredient")
      .set("x-access-token", accessToken);
    expect(result.body).to.be.not.null;
    expect(result).to.be.json;
    expect(result).to.be.status(200);
  });

  it("GET /api/v1/recipeingredient should return all ingredients", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .get("/api/v1/recipeingredient")
      .set("x-access-token", accessToken);
    expect(result.body.length).to.equal(3);
  });

  it("GET /api/v1/recipeingredient?resolve should return all ingredients with resolved fooditemTemplate", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .get("/api/v1/recipeingredient")
      .query({resolve: true})
      .set("x-access-token", accessToken);
    expect(result.body.length).to.equal(3);
    expect(result.body[0].fooditemTemplate.name).to.equal("bread");
  });

  it("GET /api/v1/recipeingredient/:id should return the ingredient with the provied id", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .get("/api/v1/recipeingredient/1234ef66b9c6c5139160b4d1")
      .set("x-access-token", accessToken);
    expect(result.body).to.deep.equal({
      _id : "1234ef66b9c6c5139160b4d1",
      updatedAt: "2017-08-27T18:48:54.865Z",
      createdAt: "2017-08-27T18:48:54.865Z",
      amount: 9,
      fooditemTemplateId: "59a2eeaaf09a4c43cb92ef0b"});
  });

  it("GET /api/v1/recipeingredient/:id?resolve should return the ingredient with the provied id and the resolved fooditemtemplate", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .get("/api/v1/recipeingredient/1234ef66b9c6c5139160b4d1")
      .query({resolve: true})
      .set("x-access-token", accessToken);
    expect(result.body._id).to.deep.equal("1234ef66b9c6c5139160b4d1");
    expect(result.body.fooditemTemplate.name).to.deep.equal("bread");
  });

  it("POST /api/v1/recipeingredient should create a new ingredient", async () => {
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.User, true);

    const requestBody = {
      amount: 111,
      fooditemTemplateId: "59a2eea98a5a150e9e829409"
    };

    const result = await TestHelper.getAgent()
      .post("/api/v1/recipeingredient")
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send(requestBody);
    expect(result.body.fooditemTemplateId).to.equal(requestBody.fooditemTemplateId);
    expect(result.body.amount).to.equal(requestBody.amount);
    expect(result.body).to.have.property("_id");
    expect(result.body).to.have.property("createdAt");
    expect(result.body).to.have.property("updatedAt");
  });

  it("PUT /api/v1/recipeingredient/:id should update the ingredient", async () => {
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.User, true);

    const requestBody = {
      amount: 111,
      fooditemTemplateId: "59a2eea98a5a150e9e829111"
    };

    const resultBefore = await TestHelper.getAgent()
      .get("/api/v1/recipeingredient/1234ef66b9c6c5139160b4d2")
      .set("x-access-token", accessToken);

    expect(resultBefore.body.amount).to.equal(2);
    expect(resultBefore.body.fooditemTemplateId).to.equal("59a2eeaaf09a4c43cb92ef0b");

    const result = await TestHelper.getAgent()
      .put("/api/v1/recipeingredient/1234ef66b9c6c5139160b4d2")
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send(requestBody);
    expect(result.body.amount).to.equal(requestBody.amount);
    expect(result.body.fooditemTemplateId).to.equal(requestBody.fooditemTemplateId);
    expect(result.body._id).to.equal(resultBefore.body._id);
    expect(result.body.updatedAt).to.be.not.equal(resultBefore.body.updatedAt);
  });

  it("DELETE /api/v1/recipeingredient/:id should delete the ingredient", async () => {
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.Admin, true);

    const resultBefore = await TestHelper.getAgent()
      .get("/api/v1/recipeingredient/1234ef66b9c6c5139160b4d3")
      .set("x-access-token", accessToken);

    expect(resultBefore.body.amount).to.equal(5);
    expect(resultBefore.body.fooditemTemplateId).to.equal("59a2eeaaf09a4c43cb92ef0b");

    const result = await TestHelper.getAgent()
      .del("/api/v1/recipeingredient/1234ef66b9c6c5139160b4d3")
      .set("x-access-token", accessToken);
    expect(result.status).to.equal(200);

    try {
      await TestHelper.getAgent()
        .get("/api/v1/recipeingredient/1234ef66b9c6c5139160b4d3")
        .set("x-access-token", accessToken);
    } catch (error) {
      expect(error.status).to.be.eql(404);
      const msg = "Recipe ingredient with ID 1234ef66b9c6c5139160b4d3 could not be found";
      expect(error.response.body).to.have.property("message", msg);
    }
  });
});

/*tslint:enable:no-unused-expression*/
