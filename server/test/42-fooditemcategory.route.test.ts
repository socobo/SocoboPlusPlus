
process.env["NODE_ENV"] = "test";

import { expect } from "chai";
import * as mocha from "mocha";
import { TestHelper } from "./helper/TestHelper";

describe("FoodItemCategoryRoute - API v1", () => {

  it("GET /api/v1/fooditemcategory should pass if a token is provided", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get("/api/v1/fooditemcategory").set("x-access-token", accessToken);
    expect(result.body).to.be.not.null;
    expect(result).to.be.json;
    expect(result).to.be.status(200);
  });

  it("GET /api/v1/fooditemcategory should return all categories", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get("/api/v1/fooditemcategory").set("x-access-token", accessToken);
    expect(result.body.length).to.equal(3);
  });

  it("GET /api/v1/fooditemcategory/:id should return one category", async () => {
    const id = "59a2f0667898dca760b01e56";
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get(`/api/v1/fooditemcategory/${id}`).set("x-access-token", accessToken);
    expect(result.body).to.not.null;
  });

  it("GET /api/v1/fooditemcategory/:id should return one category w/ id, foodItemId, name, created & lastModified prop",
    async () => {
      const id = "59a2f0667898dca760b01e56";
      const accessToken = await TestHelper.getToken();
      const result = await TestHelper.getAgent()
        .get(`/api/v1/fooditemcategory/${id}`)
        .set("x-access-token", accessToken);
      expect(result.body).to.deep.property("id");
      expect(result.body).to.deep.property("foodItemId");
      expect(result.body).to.deep.property("name");
      expect(result.body).to.deep.property("created");
      expect(result.body).to.deep.property("lastModified");
    });

  it("PUT /api/v1/fooditemcategory/:id should update the category and return the modified", async () => {
    const id = "59a2f0667898dca760b01e56";
    const accessToken = await TestHelper.getToken();
    const resultBefore = await TestHelper.getAgent()
      .get(`/api/v1/fooditemcategory/${id}`)
      .set("x-access-token", accessToken);

    const resultAfter = await TestHelper.getAgent()
      .put(`/api/v1/fooditemcategory/${id}`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send({ name: "ha-milk"});

    expect(resultAfter.body.name).to.equal("ha-milk");
    expect(resultAfter.body.name).to.not.equal(resultBefore.body.name);
    expect(resultAfter.body.lastModified).to.not.equal(resultBefore.body.lastModified);
  });

  it("POST /api/v1/fooditemcategory should save a new category and return it", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .post(`/api/v1/fooditemcategory`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send({ name: "choco milk", foodItemId: "59a2ef66b9c6c5139160b4d8" });

    expect(result.body.name).to.equal("choco milk");
    expect(result.body).to.deep.property("id");
    expect(result.body).to.deep.property("foodItemId");
    expect(result.body).to.deep.property("name");
    expect(result.body).to.deep.property("created");
    expect(result.body).to.deep.property("lastModified");
  });

  it("DELETE /api/v1/fooditemcategory/:id should delete the category and return the removed category id", async () => {
    const id = "59a2f0667898dca760b01e56";
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .del(`/api/v1/fooditemcategory/${id}`)
      .set("x-access-token", accessToken);
    expect(result.body.id).to.equal(id);
  });
});
