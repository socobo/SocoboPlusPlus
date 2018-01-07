process.env["NODE_ENV"] = "test";

import { expect } from "chai";
import * as mocha from "mocha";
import { TestHelper } from "./helper/TestHelper";

describe("FoodItemRoute - API v1", () => {

  it("GET /api/v1/fooditem should pass if a token is provided", async () => {
    const accessToken = await TestHelper.getToken(undefined, true);
    const result = await TestHelper.getAgent().get("/api/v1/fooditem").set("x-access-token", accessToken);
    expect(result.body).to.be.not.null;
    expect(result).to.be.json;
    expect(result).to.be.status(200);
  });

  it("GET /api/v1/fooditem should return all food items", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get("/api/v1/fooditem").set("x-access-token", accessToken);
    expect(result.body.length).to.equal(3);
  });

  it("GET /api/v1/fooditem?socobouserid=XYZ should return all food items for a socobo user", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .get("/api/v1/fooditem?socobouserid=59a2ee598ae9b7b45243d503")
      .set("x-access-token", accessToken);
    expect(result.body.length).to.equal(2);
  });

  it("GET /api/v1/fooditem/:id should return one fooditem", async () => {
    const id = "59a2ef66b9c6c5139160b4d8";
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get(`/api/v1/fooditem/${id}`).set("x-access-token", accessToken);
    expect(result.body).to.not.null;
  });

  it(`GET /api/v1/fooditem/:id should return one fooditem
      w/ id, foodItemTemplateId, socoboUserId, amount, bestBefore, created & lastModified prop`,
    async () => {
      const id = "59a2ef66b9c6c5139160b4d8";
      const accessToken = await TestHelper.getToken();
      const result = await TestHelper.getAgent()
        .get(`/api/v1/fooditem/${id}`)
        .set("x-access-token", accessToken);
      expect(result.body).to.deep.property("id");
      expect(result.body).to.deep.property("foodItemTemplateId");
      expect(result.body).to.deep.property("socoboUserId");
      expect(result.body).to.deep.property("amount");
      expect(result.body).to.deep.property("bestBefore");
      expect(result.body).to.deep.property("created");
      expect(result.body).to.deep.property("lastModified");
  });
});
