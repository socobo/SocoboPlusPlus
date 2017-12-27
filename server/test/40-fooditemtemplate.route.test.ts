process.env["NODE_ENV"] = "test";

import { expect } from "chai";
import * as mocha from "mocha";
import { TestHelper } from "./helper/TestHelper";

describe("FoodItemTemplateRoute - API v1", () => {

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

  it("GET /api/v1/fooditemtemplate/:id should return one template", async () => {
    const id = "59a2eea98a5a150e9e829409";
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get(`/api/v1/fooditemtemplate/${id}`).set("x-access-token", accessToken);
    expect(result.body).to.not.null;
  });

  it("GET /api/v1/fooditemtemplate/:id should return one template w/ id, name, created & lastModified property",
    async () => {
      const id = "59a2eea98a5a150e9e829409";
      const accessToken = await TestHelper.getToken();
      const result = await TestHelper.getAgent()
        .get(`/api/v1/fooditemtemplate/${id}`)
        .set("x-access-token", accessToken);
      expect(result.body).to.deep.property("id");
      expect(result.body).to.deep.property("name");
      expect(result.body).to.deep.property("created");
      expect(result.body).to.deep.property("lastModified");
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
      .send({ name: "milkXY"});

    expect(resultAfter.body.name).to.equal("milkXY");
    expect(resultAfter.body.name).to.not.equal(resultBefore.body.name);
    expect(resultAfter.body.lastModified).to.not.equal(resultBefore.body.lastModified);
  });

  it("POST /api/v1/fooditemtemplate should save a new template return it", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .post(`/api/v1/fooditemtemplate`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send({ name: "sugar"});

    expect(result.body.name).to.equal("sugar");
    expect(result.body).to.deep.property("id");
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
});
