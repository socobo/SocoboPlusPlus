import { SocoboUserRoleType } from "./../src/socobouser/enums/SocoboUserRoleType";
/*tslint:disable:no-unused-expression*/

process.env["NODE_ENV"] = "test";

import { expect } from "chai";
import * as mocha from "mocha";
import { TestHelper } from "./helper/TestHelper";

describe("RecipeCategoryRoute - API v1", () => {

  it("GET /api/v1/recipecategory should pass if a token is provided", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .get("/api/v1/recipecategory")
      .set("x-access-token", accessToken);
    expect(result.body).to.be.not.null;
    expect(result).to.be.json;
    expect(result).to.be.status(200);
  });

  it("GET /api/v1/recipecategory should return all categories", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .get("/api/v1/recipecategory")
      .set("x-access-token", accessToken);
    expect(result.body.length).to.equal(3);
  });

  it("GET /api/v1/recipecategory/:id should return the category with the provied id", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent()
      .get("/api/v1/recipecategory/5092ef66b9c6c5139160b4d1")
      .set("x-access-token", accessToken);
    expect(result.body.title).to.equal("Category 1");
    expect(result.body.description).to.equal("Category 1 Desc");
    expect(result.body._id).to.equal("5092ef66b9c6c5139160b4d1");
  });

  it("POST /api/v1/recipecategory should create a new category", async () => {
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.Admin, true);

    const requestBody = {
      description: "Created Recipe 1 Desc",
      title: "Crated Recipe 1"
    };

    const result = await TestHelper.getAgent()
      .post("/api/v1/recipecategory")
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send(requestBody);
    expect(result.body.title).to.equal(requestBody.title);
    expect(result.body.description).to.equal(requestBody.description);
    expect(result.body).to.have.property("_id");
    expect(result.body).to.have.property("createdAt");
    expect(result.body).to.have.property("updatedAt");
  });

  it("POST /api/v1/recipecategory normal user is not permitted to create a category", async () => {
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.User, true);

    const requestBody = {
      description: "Created Recipe 1 Desc",
      title: "Crated Recipe 1"
    };

    try {
      const result = await TestHelper.getAgent()
        .post("/api/v1/recipecategory")
        .set("x-access-token", accessToken)
        .set("Content-Type", "application/json")
        .send(requestBody);

    } catch (error) {
      expect(error.status).to.be.eql(403);
      const msg = "The user has unsufficient permission to access the requested resource";
      expect(error.response.body).to.have.property("message", msg);
    }
  });

  it("PUT /api/v1/recipecategory/:id should update the category", async () => {
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.Admin, true);

    const requestBody = {
      description: "Created Recipe 1 Desc UPDATED",
      title: "Crated Recipe 1 UPDATED"
    };

    const resultBefore = await TestHelper.getAgent()
      .get("/api/v1/recipecategory/5092ef66b9c6c5139160b4d1")
      .set("x-access-token", accessToken);

    expect(resultBefore.body.title).to.equal("Category 1");
    expect(resultBefore.body.description).to.equal("Category 1 Desc");

    const result = await TestHelper.getAgent()
      .put("/api/v1/recipecategory/5092ef66b9c6c5139160b4d1")
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send(requestBody);
    expect(result.body.title).to.equal(requestBody.title);
    expect(result.body.description).to.equal(requestBody.description);
    expect(result.body._id).to.equal(resultBefore.body._id);
    expect(result.body.updatedAt).to.be.not.equal(resultBefore.body.updatedAt);
  });

  it("PUT /api/v1/recipecategory/:id normal user is not permitted to update a category", async () => {
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.User, true);

    const requestBody = {
      description: "Created Recipe 1 Desc UPDATED",
      title: "Crated Recipe 1 UPDATED"
    };

    try {
      const result = await TestHelper.getAgent()
        .put("/api/v1/recipecategory/5092ef66b9c6c5139160b4d1")
        .set("x-access-token", accessToken)
        .set("Content-Type", "application/json")
        .send(requestBody);

    } catch (error) {
      expect(error.status).to.be.eql(403);
      const msg = "The user has unsufficient permission to access the requested resource";
      expect(error.response.body).to.have.property("message", msg);
    }
  });

  it("DELETE /api/v1/recipecategory/:id should delete the category", async () => {
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.Admin, true);

    const resultBefore = await TestHelper.getAgent()
      .get("/api/v1/recipecategory/5092ef66b9c6c5139160b4d3")
      .set("x-access-token", accessToken);

    expect(resultBefore.body.title).to.equal("Category 3");
    expect(resultBefore.body.description).to.equal("Category 3 Desc");

    const result = await TestHelper.getAgent()
      .del("/api/v1/recipecategory/5092ef66b9c6c5139160b4d3")
      .set("x-access-token", accessToken);
    expect(result.status).to.equal(200);

    try {
      await TestHelper.getAgent()
        .get("/api/v1/recipecategory/5092ef66b9c6c5139160b4d3")
        .set("x-access-token", accessToken);
    } catch (error) {
      expect(error.status).to.be.eql(404);
      const msg = "Recipe category with ID 5092ef66b9c6c5139160b4d3 could not be found";
      expect(error.response.body).to.have.property("message", msg);
    }
  });

  it("DELETE /api/v1/recipecategory/:id normal user is not permitted to delete a category", async () => {
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.User, true);

    try {
      const result = await TestHelper.getAgent()
        .del("/api/v1/recipecategory/5092ef66b9c6c5139160b4d3")
        .set("x-access-token", accessToken);
    } catch (error) {
      expect(error.status).to.be.eql(403);
      const msg = "The user has unsufficient permission to access the requested resource";
      expect(error.response.body).to.have.property("message", msg);
    }
  });
});

/*tslint:enable:no-unused-expression*/
