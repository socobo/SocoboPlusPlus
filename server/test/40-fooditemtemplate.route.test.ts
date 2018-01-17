process.env["NODE_ENV"] = "test";

import { expect } from "chai";
import * as mocha from "mocha";
import { TestHelper } from "./helper/TestHelper";

describe("FoodItemTemplateRoute - API v1", () => {

  beforeEach(async () => {
    await TestHelper.setUpFoodItemsDb();
  });

  it("GET /api/v1/fooditemtemplate should pass if a token is provided", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get("/api/v1/fooditemtemplate").set("x-access-token", accessToken);
    expect(result.body).to.be.not.null;
    expect(result).to.be.json;
    expect(result).to.be.status(200);
  });

  it("GET /api/v1/fooditemtemplate should return all templates", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get("/api/v1/fooditemtemplate").set("x-access-token", accessToken);
    expect(result.body.length).to.equal(3);
  });

  it("GET /api/v1/fooditemtemplate?resolve should return all templates w/ resolved categories and unit", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .get("/api/v1/fooditemtemplate?resolve")
      .set("x-access-token", accessToken);
    expect(result.body.length).to.equal(3);
  });

  it("GET /api/v1/fooditemtemplate/:id should return one template", async () => {
    const id = "59a2eea98a5a150e9e829409";
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get(`/api/v1/fooditemtemplate/${id}`).set("x-access-token", accessToken);
    expect(result.body).to.not.null;
  });

  it(`GET /api/v1/fooditemtemplate/:id?resolve should return one template
      w/ resolved categories and unit`, async () => {
    const id = "59a2eea98a5a150e9e829409";
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .get(`/api/v1/fooditemtemplate/${id}?resolve`)
      .set("x-access-token", accessToken);
    expect(result.body).to.not.null;
  });

  it(`GET /api/v1/fooditemtemplate/:id should return one template
      w/ id, categoryIds, unitId, name, created & lastModified property`,
    async () => {
      const id = "59a2eea98a5a150e9e829409";
      const accessToken = await TestHelper.getToken();
      const result = await TestHelper.getAgent()
        .get(`/api/v1/fooditemtemplate/${id}`)
        .set("x-access-token", accessToken);
      expect(result.body).to.deep.property("id");
      expect(result.body).to.deep.property("categoryIds");
      expect(result.body.categoryIds).length(2);
      expect(result.body).to.deep.property("unitId");
      expect(result.body).to.deep.property("name");
      expect(result.body).to.deep.property("created");
      expect(result.body).to.deep.property("lastModified");
  });

  it(`GET /api/v1/fooditemtemplate/:id?resolve should return one template
      w/ id, categories object array, unit object, name, created & lastModified property`,
    async () => {
      const id = "59a2eea98a5a150e9e829409";
      const accessToken = await TestHelper.getToken();
      const result = await TestHelper.getAgent()
        .get(`/api/v1/fooditemtemplate/${id}?resolve`)
        .set("x-access-token", accessToken);

      expect(result.body).to.deep.property("id");
      expect(result.body).to.deep.property("name");
      expect(result.body).to.deep.property("created");
      expect(result.body).to.deep.property("lastModified");

      expect(result.body).to.not.deep.property("categoryIds");
      expect(result.body).to.deep.property("categories");
      expect(result.body.categories).to.be.an.instanceOf(Array);
      expect(result.body.categories).length(2);
      expect(result.body.categories[0]).to.be.an.instanceOf(Object);
      expect(result.body.categories[0]).to.deep.property("id");
      expect(result.body.categories[0]).to.deep.property("name");
      expect(result.body.categories[0]).to.deep.property("created");
      expect(result.body.categories[0]).to.deep.property("lastModified");

      expect(result.body).to.not.deep.property("unitId");
      expect(result.body).to.deep.property("unit");
      expect(result.body.unit).to.be.an.instanceOf(Object);
      expect(result.body.unit).to.deep.property("id");
      expect(result.body.unit).to.deep.property("name");
      expect(result.body.unit).to.deep.property("created");
      expect(result.body.unit).to.deep.property("lastModified");
  });

  it("PUT /api/v1/fooditemtemplate/:id should update the template and return the modified", async () => {
    const id = "59a2eea98a5a150e9e829409";
    const accessToken = await TestHelper.getToken();
    const resultBefore = await TestHelper.getAgent()
      .get(`/api/v1/fooditemtemplate/${id}`)
      .set("x-access-token", accessToken);

    const resultAfter = await TestHelper.getAgent()
      .put(`/api/v1/fooditemtemplate/${id}`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send({
        categoryIds: [
          "59a2f0667898dca760b01e56",
          "59a2f080218278a691dc5d41"
        ],
        name: "milkXY",
        unitId: "59a2f14eae4fedd7d86f2d9b"
      });

    expect(resultAfter.body).to.deep.property("categoryIds");
    expect(resultAfter.body.categoryIds).to.deep.equal(resultBefore.body.categoryIds);

    expect(resultAfter.body).to.deep.property("name");
    expect(resultAfter.body.name).to.equal("milkXY");
    expect(resultAfter.body.name).to.not.equal(resultBefore.body.name);

    expect(resultAfter.body).to.deep.property("unitId");
    expect(resultAfter.body.unitId).to.equal(resultBefore.body.unitId);

    expect(resultAfter.body).to.deep.property("lastModified");
    expect(resultAfter.body.lastModified).to.not.equal(resultBefore.body.lastModified);
  });

  it("PUT /api/v1/fooditemtemplate/:id should fail if the template id is unknown", async () => {
    try {
      const id = "59a2eea98a5a150e9e829680";
      const accessToken = await TestHelper.getToken();
      const result = await TestHelper.getAgent()
        .put(`/api/v1/fooditemtemplate/${id}`)
        .set("x-access-token", accessToken)
        .set("Content-Type", "application/json")
        .send({
          categoryIds: [
            "59a2f0667898dca760b01e56",
            "59a2f080218278a691dc5d41"
          ],
          name: "milkXY",
          unitId: "59a2f14eae4fedd7d86f2d9b"
        });
    } catch (error) {
      const errorBody = error.response.body;
      const errorMessage = "Fooditem Template with id UNKNOWN could not be found";
      expect(errorBody).to.have.deep.property("message", errorMessage);
      expect(errorBody).to.have.deep.property("method", "_transformResult(..)");
      expect(errorBody).to.have.deep.property("source", "FoodItemTemplateRepository");
    }
  });

  it("POST /api/v1/fooditemtemplate should save a new template return it", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .post(`/api/v1/fooditemtemplate`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send({
        categoryIds: [
          "5a51d4db54bafd29f86b6430"
        ],
        name: "sugar",
        unitId: "59dbb22f96a13f5f8bb65914"
      });

    expect(result.body.name).to.equal("sugar");
    expect(result.body).to.deep.property("id");
    expect(result.body).to.deep.property("categoryIds");
    expect(result.body.categoryIds).length(1);
    expect(result.body).to.deep.property("unitId");
    expect(result.body).to.deep.property("name");
    expect(result.body).to.deep.property("created");
    expect(result.body).to.deep.property("lastModified");
  });

  it("DELETE /api/v1/fooditemtemplate/:id should delete the template and return the removed template id", async () => {
    const id = "59a2eea98a5a150e9e829409";
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .del(`/api/v1/fooditemtemplate/${id}`)
      .set("x-access-token", accessToken);
    expect(result.body.id).to.equal(id);
  });

  it("DELETE /api/v1/fooditemtemplate/:id should fail if the template id is unknown", async () => {
    try {
      const id = "59a2eea98a5a150e9e829680";
      const accessToken = await TestHelper.getToken();
      const result = await TestHelper.getAgent()
        .del(`/api/v1/fooditemtemplate/${id}`)
        .set("x-access-token", accessToken);
    } catch (error) {
      const errorBody = error.response.body;
      const errorMessage = "Fooditem Template with id UNKNOWN could not be found";
      expect(errorBody).to.have.deep.property("message", errorMessage);
      expect(errorBody).to.have.deep.property("method", "_transformResult(..)");
      expect(errorBody).to.have.deep.property("source", "FoodItemTemplateRepository");
    }
  });
});
