process.env["NODE_ENV"] = "test";

import { expect } from "chai";
import * as mocha from "mocha";
import { TestHelper } from "./helper/TestHelper";

describe("FoodItemUnitRoute - API v1", () => {

  it("GET /api/v1/fooditemunit should pass if a token is provided", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get("/api/v1/fooditemunit").set("x-access-token", accessToken);
    expect(result.body).to.be.not.null;
    expect(result).to.be.json;
    expect(result).to.be.status(200);
  });

  it("GET /api/v1/fooditemunit should return all units", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get("/api/v1/fooditemunit").set("x-access-token", accessToken);
    expect(result.body.length).to.equal(3);
  });

  it("GET /api/v1/fooditemunit/:id should return one unit", async () => {
    const id = "59a2f14d7f4daed7367bc676";
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get(`/api/v1/fooditemunit/${id}`).set("x-access-token", accessToken);
    expect(result.body).to.not.null;
  });

  it("GET /api/v1/fooditemunit/:id should return one unit w/ id, foodItemId, name, created & lastModified property",
    async () => {
      const id = "59a2f14d7f4daed7367bc676";
      const accessToken = await TestHelper.getToken();
      const result = await TestHelper.getAgent()
        .get(`/api/v1/fooditemunit/${id}`)
        .set("x-access-token", accessToken);
      expect(result.body).to.deep.property("id");
      expect(result.body).to.deep.property("name");
      expect(result.body).to.deep.property("created");
      expect(result.body).to.deep.property("lastModified");
  });

  it("PUT /api/v1/fooditemunit/:id should update the unit and return the modified", async () => {
    const id = "59a2f14d7f4daed7367bc676";
    const accessToken = await TestHelper.getToken();
    const resultBefore = await TestHelper.getAgent()
      .get(`/api/v1/fooditemunit/${id}`)
      .set("x-access-token", accessToken);

    const resultAfter = await TestHelper.getAgent()
      .put(`/api/v1/fooditemunit/${id}`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send({ name: "litreXYZ" });

    expect(resultAfter.body.name).to.equal("litreXYZ");
    expect(resultAfter.body.name).to.not.equal(resultBefore.body.name);
    expect(resultAfter.body.lastModified).to.not.equal(resultBefore.body.lastModified);
  });

  it("PUT /api/v1/fooditemunit/:id should fail if the unit id is unknown", async () => {
    try {
      const id = "59a2f14d7f4daed7367bc800";
      const accessToken = await TestHelper.getToken();
      const result = await TestHelper.getAgent()
        .put(`/api/v1/fooditemunit/${id}`)
        .set("x-access-token", accessToken)
        .set("Content-Type", "application/json")
        .send({ name: "litreXYZ" });
    } catch (error) {
      const errorBody = error.response.body;
      const errorMessage = "Fooditem Unit with id UNKNOWN could not be found";
      expect(errorBody).to.have.deep.property("message", errorMessage);
      expect(errorBody).to.have.deep.property("method", "_transformResult(..)");
      expect(errorBody).to.have.deep.property("source", "FoodItemUnitRepository");
    }
  });

  it("POST /api/v1/fooditemunit should save a new unit and return it", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .post(`/api/v1/fooditemunit`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send({ name: "kilo gramm" });

    expect(result.body.name).to.equal("kilo gramm");
    expect(result.body).to.deep.property("id");
    expect(result.body).to.deep.property("name");
    expect(result.body).to.deep.property("created");
    expect(result.body).to.deep.property("lastModified");
  });

  it("DELETE /api/v1/fooditemunit/:id should delete the unit and return the removed unit id", async () => {
    const id = "59a2f14d7f4daed7367bc676";
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .del(`/api/v1/fooditemunit/${id}`)
      .set("x-access-token", accessToken);
    expect(result.body.id).to.equal(id);
  });

  it("DELETE /api/v1/fooditemunit/:id should fail if the unit id is unknown", async () => {
    try {
      const id = "59a2f14d7f4daed7367bc800";
      const accessToken = await TestHelper.getToken();
      const result = await TestHelper.getAgent()
        .del(`/api/v1/fooditemunit/${id}`)
        .set("x-access-token", accessToken);
    } catch (error) {
      const errorBody = error.response.body;
      const errorMessage = "Fooditem Unit with id UNKNOWN could not be found";
      expect(errorBody).to.have.deep.property("message", errorMessage);
      expect(errorBody).to.have.deep.property("method", "_transformResult(..)");
      expect(errorBody).to.have.deep.property("source", "FoodItemUnitRepository");
    }
  });
});
