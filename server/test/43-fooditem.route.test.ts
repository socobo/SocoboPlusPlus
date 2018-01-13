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

  // it(`GET /api/v1/fooditem/:id?resolve should return one food item
  //     w/ resolved food item template and socobouser`, async () => {

  //   const id = "59a2ef66b9c6c5139160b4d8";
  //   const accessToken = await TestHelper.getToken();
  //   const result = await TestHelper.getAgent()
  //     .get(`/api/v1/fooditem/${id}?resolve`)
  //     .set("x-access-token", accessToken);

  //   expect(result.body).to.deep.property("id");
  //   expect(result.body).to.deep.property("amount");
  //   expect(result.body).to.deep.property("bestBefore");
  //   expect(result.body).to.deep.property("created");
  //   expect(result.body).to.deep.property("lastModified");

  //   expect(result.body).to.not.deep.property("foodItemTemplateId");
  //   expect(result.body).to.deep.property("foodItemTemplate");
  //   expect(result.body.foodItemTemplate).to.deep.property("id");
  //   expect(result.body.foodItemTemplate).to.deep.property("categoryIds");
  //   expect(result.body.foodItemTemplate).to.deep.property("unitId");
  //   expect(result.body.foodItemTemplate).to.deep.property("name");
  //   expect(result.body.foodItemTemplate).to.deep.property("created");
  //   expect(result.body.foodItemTemplate).to.deep.property("lastModified");

  //   expect(result.body).to.not.deep.property("socoboUserId");
  //   expect(result.body.socoboUser).to.deep.property("socoboUser");
  //   expect(result.body.socoboUser).to.deep.property("id");
  //   expect(result.body.socoboUser).to.deep.property("username");
  //   expect(result.body.socoboUser).to.deep.property("email");
  //   expect(result.body.socoboUser).to.deep.property("hasTermsAccepted");
  //   expect(result.body.socoboUser).to.deep.property("role");
  //   expect(result.body.socoboUser).to.deep.property("provider");
  //   expect(result.body.socoboUser).to.deep.property("imageUrl");
  //   expect(result.body.socoboUser).to.deep.property("created");
  //   expect(result.body.socoboUser).to.deep.property("lastModified");
  //   expect(result.body.socoboUser).to.not.deep.property("password");

  // });

  // it(`GET /api/v1/fooditem/:id?resolve-deep should return one food item
  //     w/ deep resolved food item template and socobouser`, async () => {

  //   const id = "59a2ef66b9c6c5139160b4d8";
  //   const accessToken = await TestHelper.getToken();
  //   const result = await TestHelper.getAgent()
  //     .get(`/api/v1/fooditem/${id}?resolve`)
  //     .set("x-access-token", accessToken);

  //   expect(result.body).to.deep.property("id");
  //   expect(result.body).to.deep.property("amount");
  //   expect(result.body).to.deep.property("bestBefore");
  //   expect(result.body).to.deep.property("created");
  //   expect(result.body).to.deep.property("lastModified");

  //   expect(result.body).to.not.deep.property("foodItemTemplateId");
  //   expect(result.body).to.deep.property("foodItemTemplate");
  //   expect(result.body.foodItemTemplate).to.deep.property("id");
  //   expect(result.body.foodItemTemplate).to.deep.property("name");
  //   expect(result.body.foodItemTemplate).to.deep.property("created");
  //   expect(result.body.foodItemTemplate).to.deep.property("lastModified");

  //   expect(result.body.foodItemTemplate).to.not.deep.property("categoryIds");
  //   expect(result.body.foodItemTemplate).to.deep.property("categories");
  //   expect(result.body.foodItemTemplate.categories).to.be.an.instanceOf(Array);
  //   expect(result.body.foodItemTemplate.categories[0]).to.be.an.instanceOf(Object);
  //   expect(result.body.foodItemTemplate.categories[0]).to.deep.property("id");
  //   expect(result.body.foodItemTemplate.categories[0]).to.deep.property("name");
  //   expect(result.body.foodItemTemplate.categories[0]).to.deep.property("created");
  //   expect(result.body.foodItemTemplate.categories[0]).to.deep.property("lastModified");

  //   expect(result.body.foodItemTemplate).to.not.deep.property("unitId");
  //   expect(result.body.foodItemTemplate).to.deep.property("unit");
  //   expect(result.body.foodItemTemplate.unit).to.be.an.instanceOf(Object);
  //   expect(result.body.foodItemTemplate.unit).to.deep.property("id");
  //   expect(result.body.foodItemTemplate.unit).to.deep.property("name");
  //   expect(result.body.foodItemTemplate.unit).to.deep.property("created");
  //   expect(result.body.foodItemTemplate.unit).to.deep.property("lastModified");

  //   expect(result.body).to.not.deep.property("socoboUserId");
  //   expect(result.body.socoboUser).to.deep.property("socoboUser");
  //   expect(result.body.socoboUser).to.deep.property("id");
  //   expect(result.body.socoboUser).to.deep.property("username");
  //   expect(result.body.socoboUser).to.deep.property("email");
  //   expect(result.body.socoboUser).to.deep.property("hasTermsAccepted");
  //   expect(result.body.socoboUser).to.deep.property("role");
  //   expect(result.body.socoboUser).to.deep.property("provider");
  //   expect(result.body.socoboUser).to.deep.property("imageUrl");
  //   expect(result.body.socoboUser).to.deep.property("created");
  //   expect(result.body.socoboUser).to.deep.property("lastModified");
  //   expect(result.body.socoboUser).to.not.deep.property("password");

  // });

  // it("PUT /api/v1/fooditem/:id should update the fooditem and return the modified", async () => {

  //   const id = "59a2ef68310b123d61063301";
  //   const accessToken = await TestHelper.getToken();
  //   const resultBefore = await TestHelper.getAgent()
  //     .get(`/api/v1/fooditem/${id}`)
  //     .set("x-access-token", accessToken);

  //   const resultAfter = await TestHelper.getAgent()
  //     .put(`/api/v1/fooditem/${id}`)
  //     .set("x-access-token", accessToken)
  //     .set("Content-Type", "application/json")
  //     .send({
  //       amount: 25,
  //       bestBefore: 1501948817400,
  //       created: 1503849392349,
  //       foodItemTemplateId: "59a2eeaaf09a4c43cb92ef0b",
  //       socoboUserId: "59a2ee5be2c06ab513940b84"
  //     });

  //   expect(resultAfter.body).to.deep.property("foodItemTemplateId");
  //   expect(resultAfter.body.foodItemTemplateId).to.deep.equal(resultBefore.body.foodItemTemplateId);

  //   expect(resultAfter.body).to.deep.property("socoboUserId");
  //   expect(resultAfter.body.socoboUserId).to.equal(resultBefore.body.socoboUserId);

  //   expect(resultAfter.body).to.deep.property("amount");
  //   expect(resultAfter.body.name).to.equal(25);
  //   expect(resultAfter.body.name).to.not.equal(resultBefore.body.name);

  //   expect(resultAfter.body).to.deep.property("bestBefore");
  //   expect(resultAfter.body.bestBefore).to.not.equal(resultBefore.body.bestBefore);

  //   expect(resultAfter.body).to.deep.property("created");
  //   expect(resultAfter.body.created).to.not.equal(resultBefore.body.created);

  //   expect(resultAfter.body).to.deep.property("lastModified");
  //   expect(resultAfter.body.lastModified).to.not.equal(resultBefore.body.lastModified);

  // });

  // it("PUT /api/v1/fooditem/:id should fail if the food item id is unknown", async () => {
  //   try {
  //     const id = "59a2eea98a5a150e9e829680";
  //     const accessToken = await TestHelper.getToken();
  //     const result = await TestHelper.getAgent()
  //       .put(`/api/v1/fooditem/${id}`)
  //       .set("x-access-token", accessToken)
  //       .set("Content-Type", "application/json")
  //       .send({
  //         amount: 25,
  //         bestBefore: 1501948817400,
  //         created: 1503849392349,
  //         foodItemTemplateId: "59a2eeaaf09a4c43cb92ef0b",
  //         socoboUserId: "59a2ee598ae9b7b45243d503"
  //       });
  //   } catch (error) {
  //     const errorBody = error.response.body;
  //     const errorMessage = "Fooditem with id UNKNOWN could not be found";
  //     expect(errorBody).to.have.deep.property("message", errorMessage);
  //     expect(errorBody).to.have.deep.property("method", "_transformResult(..)");
  //     expect(errorBody).to.have.deep.property("source", "FoodItemRepository");
  //   }
  // });

  // it("POST /api/v1/fooditem should save a new food item return it", async () => {
  //   const accessToken = await TestHelper.getToken();
  //   const result = await TestHelper.getAgent()
  //     .post(`/api/v1/fooditem`)
  //     .set("x-access-token", accessToken)
  //     .set("Content-Type", "application/json")
  //     .send({
  //       amount: 30,
  //       bestBefore: 1501948817400,
  //       created: 1503849392349,
  //       foodItemTemplateId: "59a2eeaaf09a4c43cb92ef0b",
  //       socoboUserId: "59a2ee598ae9b7b45243d503"
  //     });

  //   expect(result.body.amount).to.equal(30);
  //   expect(result.body).to.deep.property("foodItemTemplateId");
  //   expect(result.body).to.deep.property("socoboUserId");
  //   expect(result.body).to.deep.property("amount");
  //   expect(result.body).to.deep.property("bestBefore");
  //   expect(result.body).to.deep.property("created");
  //   expect(result.body).to.deep.property("lastModified");
  // });

  // it("DELETE /api/v1/fooditem/:id should delete the food item and return the removed id", async () => {
  //   const id = "59a2ef68310b123d61063301";
  //   const accessToken = await TestHelper.getToken();
  //   const result = await TestHelper.getAgent()
  //     .del(`/api/v1/fooditemtemplate/${id}`)
  //     .set("x-access-token", accessToken);
  //   expect(result.body.id).to.equal(id);
  // });

  // it("DELETE /api/v1/fooditem/:id should fail if the food item id is unknown", async () => {
  //   try {
  //     const id = "59a2ef68310b123d61063401";
  //     const accessToken = await TestHelper.getToken();
  //     const result = await TestHelper.getAgent()
  //       .del(`/api/v1/fooditem/${id}`)
  //       .set("x-access-token", accessToken);
  //   } catch (error) {
  //     const errorBody = error.response.body;
  //     const errorMessage = "Fooditem with id UNKNOWN could not be found";
  //     expect(errorBody).to.have.deep.property("message", errorMessage);
  //     expect(errorBody).to.have.deep.property("method", "_transformResult(..)");
  //     expect(errorBody).to.have.deep.property("source", "FoodItemRepository");
  //   }
  // });
});
