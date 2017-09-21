/*tslint:disable:no-unused-expression*/

process.env["NODE_ENV"] = "test";

import * as chai from "chai";
import chaiHttp = require("chai-http");
import * as mocha from "mocha";
import Server from "./../src/server";

chai.use(chaiHttp);

describe("RecipeRoute - API v1", () => {

  const expect = chai.expect;

  // define login function
  const login = async (): Promise<string|any> => {
    try {
      const user = { email: "admin2@test.test", password: "password" };
      const result = await chai.request(Server).post("/api/v1/auth/login").send(user);
      return result.body.token;
    } catch (error) {
      return error;
    }
  };

  it("GET /api/v1/recipe should pass if a token is provided", async () => {
    const accessToken = await login();
    const result = await chai.request(Server).get("/api/v1/recipe").set("x-access-token", accessToken);
    expect(result.body).to.be.not.null;
    expect(result).to.be.json;
    expect(result).to.be.status(200);
  });

  it("GET /api/v1/recipe should return all recipes", async () => {
    const accessToken = await login();
    const result = await chai.request(Server).get("/api/v1/recipe").set("x-access-token", accessToken);
    expect(result.body.length).to.equal(3);
  });

  it("GET /api/v1/recipe/search?property=searchTerm should return the searched recipe", async () => {
    const accessToken = await login();
    const result = await chai.request(Server).get("/api/v1/recipe/search/field")
      .query({title: "TestData3"})
      .set("x-access-token", accessToken);
    expect(result.body[0].title).to.equal("TestData3");
  });

  it("GET /api/v1/recipe/:id should return one recipe", async () => {
    const id = "59a2ef66b9c6c5139160b4d1";
    const accessToken = await login();
    const result = await chai.request(Server).get(`/api/v1/recipe/${id}`).set("x-access-token", accessToken);
    expect(result.body.title).to.be.equal("TestData1");
  });

  it("POST /api/v1/recipe should create a new recipe and return it", async () => {
    const recipe = {
      description: "NewRecipe",
      duration: 100,
      level: "EXPERT",
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
    const accessToken = await login();
    const result = await chai.request(Server).post(`/api/v1/recipe`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send(recipe);
    expect(result.body.title).to.be.equal("NewRecipe");

  });

  it("POST /api/v1/recipe should fail for wrongly orderd step numbers", async () => {
    const recipe = {
      description: "NewRecipe",
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
      const accessToken = await login();
      const result = await chai.request(Server).post(`/api/v1/recipe`)
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
      level: "EXPERT",
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
      const accessToken = await login();
      const result = await chai.request(Server).post(`/api/v1/recipe`)
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

  it("DELETE /api/v1/recipe:id should delete the recipe", async () => {
    const id = "59a2ef66b9c6c5139160b4d1";
    const accessToken = await login();
    const resultBeforeDeletion = await chai.request(Server)
      .get("/api/v1/recipe")
      .set("x-access-token", accessToken);
    const result = await chai.request(Server).del(`/api/v1/recipe/${id}`)
      .set("x-access-token", accessToken);
    expect(result).to.be.status(200);
    const resultAfterDeletion = await chai.request(Server)
      .get("/api/v1/recipe")
      .set("x-access-token", accessToken);
    expect(resultAfterDeletion.body.length).to.equal(resultBeforeDeletion.body.length - 1);

  });

  it("PUT /api/v1/recipe:id should correctly change the whole recipe", async () => {
    const id = "59a2ef66b9c6c5139160b4d2";
    const newRecipe = {
      description: "ChangedRecipe",
      duration: 1,
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
    const accessToken = await login();
    const result = await chai.request(Server).put(`/api/v1/recipe/${id}`)
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
      title: "ChangedRecipe"
    };
    const accessToken = await login();
    const result = await chai.request(Server).put(`/api/v1/recipe/${id}`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send(newRecipe);
    expect(result.body.title).to.be.equal("ChangedRecipe");
    expect(result.body.duration).to.be.equal(1);
    expect(result.body.description).to.be.equal("TestData3");
    expect(result.body.steps[1].stepTitle).to.be.equal("TestDataStep2");
  });

  // it("GET /api/v1/fooditemtemplate/:id should return one template w/ id, name, created & lastModified property",
  //   async () => {
  //     const id = "59a2eea98a5a150e9e829409";
  //     const token = await login();
  //     const result = await chai.request(Server).get(`/api/v1/fooditemtemplate/${id}`).set("x-access-token", token);
  //     expect(result.body).to.deep.property("id");
  //     expect(result.body).to.deep.property("name");
  //     expect(result.body).to.deep.property("created");
  //     expect(result.body).to.deep.property("lastModified");
  //   });

  // it("PUT /api/v1/fooditemtemplate/:id should update the template and return the modified", async () => {
  //   const id = "59a2eea98a5a150e9e829409";
  //   const accessToken = await login();

  //   const resultBefore = await chai.request(Server)
  //     .get(`/api/v1/fooditemtemplate/${id}`)
  //     .set("x-access-token", accessToken);

  //   const resultAfter = await chai.request(Server)
  //     .put(`/api/v1/fooditemtemplate/${id}`)
  //     .set("x-access-token", accessToken)
  //     .set("Content-Type", "application/json")
  //     .send({ name: "milkXY"});

  //   expect(resultAfter.body.name).to.equal("milkXY");
  //   expect(resultAfter.body.name).to.not.equal(resultBefore.body.name);
  //   expect(resultAfter.body.lastModified).to.not.equal(resultBefore.body.lastModified);
  // });

  // it("POST /api/v1/fooditemtemplate should save a new template return it", async () => {
  //   const accessToken = await login();
  //   const result = await chai.request(Server)
  //     .post(`/api/v1/fooditemtemplate`)
  //     .set("x-access-token", accessToken)
  //     .set("Content-Type", "application/json")
  //     .send({ name: "sugar"});

  //   expect(result.body.name).to.equal("sugar");
  //   expect(result.body).to.deep.property("id");
  //   expect(result.body).to.deep.property("name");
  //   expect(result.body).to.deep.property("created");
  //   expect(result.body).to.deep.property("lastModified");
  // });

  // it("DELETE /api/v1/fooditemtemplate/:id should delete
  // the template and return the removed template id", async () => {
  //   const id = "59a2eea98a5a150e9e829409";
  //   const accessToken = await login();
  //   const result = await chai.request(Server)
  //     .del(`/api/v1/fooditemtemplate/${id}`)
  //     .set("x-access-token", accessToken);
  //   expect(result.body.id).to.equal(id);
  // });
});

/*tslint:enable:no-unused-expression*/
