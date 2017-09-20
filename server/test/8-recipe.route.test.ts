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
    expect(result.body.length).to.equal(2);
  });

  it("GET /api/v1/recipe/:id should return one recipe", async () => {
    const id = "59a2ef66b9c6c5139160b4d1";
    const accessToken = await login();
    const result = await chai.request(Server).get(`/api/v1/recipe/${id}`).set("x-access-token", accessToken);
    expect(result.body.title).to.be.equal("TestData1");
  });

  it("POST /api/v1/recipe should return create a new recipe and return it", async () => {
    const recipe = {
      description: "NewRecipe",
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
    const accessToken = await login();
    const result = await chai.request(Server).post(`/api/v1/recipe`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send(JSON.stringify(recipe));
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
        .send(JSON.stringify(recipe));

    } catch (error) {
      expect(error.status).to.be.eql(400);
      const msg = "The provided input is invalid";
      expect(error.response.body).to.have.property("message", msg);
      expect(error.response.body.validationErrors[0].constraints).to.have.property("RecipeStepsOrder");
    }
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
