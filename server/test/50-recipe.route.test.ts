process.env["NODE_ENV"] = "test";

import { expect } from "chai";
import * as mocha from "mocha";

import { SocoboUser, SocoboUserRoleType } from "../src/socobouser/index";
import { TestHelper } from "./helper/TestHelper";

describe("RecipeRoute - API v1", () => {

  beforeEach(async () => {
    await TestHelper.setUpRecipesDb();
  });

  it("GET /api/v1/recipe should pass if a token is provided", async () => {
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.Admin, true);
    const result = await TestHelper.getAgent().get("/api/v1/recipe").set("x-access-token", accessToken);
    expect(result.body).to.be.not.null;
    expect(result).to.be.json;
    expect(result).to.be.status(200);
  });

  it("GET /api/v1/recipe should only get the allowed recipes", async () => {
    const accessToken = await TestHelper
    .getToken(SocoboUserRoleType.User, true);
    const result = await TestHelper.getAgent()
      .get("/api/v1/recipe").set("x-access-token", accessToken);
    expect(result.body.length).to.equal(2);
  });

  it("GET /api/v1/recipe should return all recipes", async () => {
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.Admin, true);
    const result = await TestHelper.getAgent().get("/api/v1/recipe").set("x-access-token", accessToken);
    expect(result.body.length).to.equal(3);
  });

  it("GET /api/v1/recipe/search?property=searchTerm should return the searched recipe", async () => {
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get("/api/v1/recipe/search/field")
      .query({title: "TestData3"})
      .set("x-access-token", accessToken);
    expect(result.body[0].title).to.equal("TestData3");
  });

  it("GET /api/v1/recipe/:id should return one recipe", async () => {
    const id = "59a2ef66b9c6c5139160b4d2";
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().get(`/api/v1/recipe/${id}`).set("x-access-token", accessToken);
    expect(result.body.title).to.be.equal("TestData2");
  });

  it("GET /api/v1/recipe/:id should fail if user has no read permission", async () => {
    const id = "59a2ef66b9c6c5139160b4d1";
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.User, true);
    try {
      const result = await TestHelper.getAgent().get(`/api/v1/recipe/${id}`).set("x-access-token", accessToken);
    } catch (error) {
      expect(error.status).to.be.eql(403);
      const msg = "You are not allowed to access this resource";
      expect(error.response.body).to.have.property("message", msg);
    }
  });

  it("PUT /api/v1/recipe:id should fail if user as no edit permission", async () => {
    const id = "59a2ef66b9c6c5139160b4d1";
    const newRecipe = {
      description: "ChangedRecipe",
      duration: 1,
      ingredients: ["1234ef66b9c6c5139160b4d1"],
      level: "BEGINNER",
      steps: [
        {
            stepDescription: "ChangedRecipe",
            stepNumber: 1,
            stepTitle: "ChangedRecipe"
        },
        {
            stepDescription: "ChangedRecipe",
            stepNumber: 2,
            stepTitle: "ChangedRecipe"
        }
      ],
      title: "ChangedRecipe",
      userId: "59a2ee5d6b1ad6c629e9b2fc"
    };
    const accessToken = await TestHelper
      .getTokenForEmailAndPassword("admin", "$2a$10$twfsBw9Ljl9kjFSvuhyAUOqpEJla0yHhVkeZo4VdTa03./KCjX5ga", true);
    try {
      const result = await TestHelper.getAgent().put(`/api/v1/recipe/${id}`)
        .set("x-access-token", accessToken)
        .set("Content-Type", "application/json")
        .send(newRecipe);
    } catch (error) {
      expect(error.status).to.be.eql(403);
      const msg = "You are not allowed to access this resource";
      expect(error.response.body).to.have.property("message", msg);
    }
  });

  it("PUT /api/v1/recipe:id should correctly change the whole recipe", async () => {
    const id = "59a2ef66b9c6c5139160b4d2";
    const newRecipe = {
      description: "ChangedRecipe",
      duration: 1,
      ingredients: ["1234ef66b9c6c5139160b4d1"],
      level: "BEGINNER",
      steps: [
        {
            stepDescription: "ChangedRecipe",
            stepNumber: 1,
            stepTitle: "ChangedRecipe"
        },
        {
            stepDescription: "ChangedRecipe",
            stepNumber: 2,
            stepTitle: "ChangedRecipe"
        }
      ],
      title: "ChangedRecipe",
      userId: "59a2ee5d6b1ad6c629e9b2fc"
    };
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.Admin, true);
    const result = await TestHelper.getAgent().put(`/api/v1/recipe/${id}`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send(newRecipe);
    expect(result.body.title).to.be.equal("ChangedRecipe");
    expect(result.body.level).to.be.equal("BEGINNER");
    expect(result.body.steps[1].stepTitle).to.be.equal("ChangedRecipe");
  });

  it("PUT /api/v1/recipe:id should correctly change a particular property of the recipe", async () => {
    const id = "59a2ef66b9c6c5139160b4d3";
    const newRecipe = {
      duration: 1,
      ingredients: ["1234ef66b9c6c5139160b4d1"],
      title: "ChangedRecipe"
    };
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.Admin, true);
    const result = await TestHelper.getAgent().put(`/api/v1/recipe/${id}`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send(newRecipe);
    expect(result.body.title).to.be.equal("ChangedRecipe");
    expect(result.body.duration).to.be.equal(1);
    expect(result.body.description).to.be.equal("TestData3");
    expect(result.body.steps[1].stepTitle).to.be.equal("TestDataStep2");
  });

  it("POST /api/v1/recipe should create a new recipe and return it", async () => {
    const recipe = {
      description: "NewRecipe",
      duration: 100,
      ingredients: ["1234ef66b9c6c5139160b4d1"],
      isPublic: true,
      level: "EXPERT",
      owner: "59a5a4013eeef0c7a9d00640",
      steps: [
        {
            stepDescription: "NewRecipe",
            stepNumber: 1,
            stepTitle: "NewRecipe"
        },
        {
            stepDescription: "NewRecipe",
            stepNumber: 2,
            stepTitle: "NewRecipe"
        }
      ],
      title: "NewRecipe",
      userId: "59a2ee5d6b1ad6c629e9b2fc"
    };
    const accessToken = await TestHelper.getToken();
    const result = await TestHelper.getAgent().post(`/api/v1/recipe`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send(recipe);
    expect(result.body.title).to.be.equal("NewRecipe");

  });

  it("POST /api/v1/recipe should fail for wrongly orderd step numbers", async () => {
    const recipe = {
      description: "NewRecipe",
      ingredients: ["1234ef66b9c6c5139160b4d1"],
      steps: [
        {
            stepDescription: "NewRecipe",
            stepNumber: 2,
            stepTitle: "NewRecipe"
        },
        {
            stepDescription: "NewRecipe",
            stepNumber: 3,
            stepTitle: "NewRecipe"
        }
      ],
      title: "NewRecipe",
      userId: "59a5a4013eeef0c7a9d00640"
    };

    try {
      const accessToken = await TestHelper.getToken();
      const result = await TestHelper.getAgent().post(`/api/v1/recipe`)
        .set("x-access-token", accessToken)
        .set("Content-Type", "application/json")
        .send(recipe);

    } catch (error) {
      expect(error.status).to.be.eql(400);
      const msg = "The provided input is invalid";
      expect(error.response.body).to.have.property("message", msg);
      expect(error.response.body.validationErrors[0]
        .constraints).to.have
        .property("RecipeStepsOrder", "Recipe step numbers must be in correct order");
    }
  });

  it("POST /api/v1/recipe should fail for wrong level", async () => {
    const recipe = {
      description: "NewRecipe",
      duration: 100,
      ingredients: ["1234ef66b9c6c5139160b4d1"],
      isPublic: true,
      level: "EXPERT",
      owner: "59a5a4013eeef0c7a9d00640",
      steps: [
        {
            stepDescription: "NewRecipe",
            stepNumber: 1,
            stepTitle: "NewRecipe"
        },
        {
            stepDescription: "NewRecipe",
            stepNumber: 2,
            stepTitle: "NewRecipe"
        }
      ],
      title: "NewRecipe",
      userId: "59a5a4013eeef0c7a9d00640"
    };

    try {
      const accessToken = await TestHelper.getToken();
      const result = await TestHelper.getAgent().post(`/api/v1/recipe`)
        .set("x-access-token", accessToken)
        .set("Content-Type", "application/json")
        .send(recipe);

    } catch (error) {
      expect(error.status).to.be.eql(400);
      const msg = "The provided input is invalid";
      expect(error.response.body).to.have.property("message", msg);
      expect(error.response.body.validationErrors[0]
        .constraints).to.have
        .property("RecipeLevel", "Recipe level must be one of: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT");
    }
  });

  it("DELETE /api/v1/recipe:id should be forbidden for non owners", async () => {
    const id = "59a2ef66b9c6c5139160b4d1";

    try {
      const accessToken = await TestHelper
      .getTokenForEmailAndPassword("admin", "$2a$10$twfsBw9Ljl9kjFSvuhyAUOqpEJla0yHhVkeZo4VdTa03./KCjX5ga", true);
      const result = await TestHelper.getAgent().del(`/api/v1/recipe/${id}`)
        .set("x-access-token", accessToken);
    } catch (error) {
      expect(error.status).to.be.eql(403);
      const msg = "You are not allowed to access this resource";
      expect(error.response.body).to.have.property("message", msg);
    }
  });

  it("DELETE /api/v1/recipe:id should delete the recipe", async () => {
    const id = "59a2ef66b9c6c5139160b4d1";
    const accessToken = await TestHelper.getToken(SocoboUserRoleType.Admin, true);
    const resultBeforeDeletion = await TestHelper.getAgent()
      .get("/api/v1/recipe")
      .set("x-access-token", accessToken);
    const result = await TestHelper.getAgent().del(`/api/v1/recipe/${id}`)
      .set("x-access-token", accessToken);
    expect(result).to.be.status(200);
    const resultAfterDeletion = await TestHelper.getAgent()
      .get("/api/v1/recipe")
      .set("x-access-token", accessToken);
    expect(resultAfterDeletion.body.length).to.equal(resultBeforeDeletion.body.length - 1);

  });
});
