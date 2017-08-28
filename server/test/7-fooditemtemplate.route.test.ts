/*tslint:disable:no-unused-expression*/

process.env["NODE_ENV"] = "test";

import * as chai from "chai";
import chaiHttp = require("chai-http");
import * as mocha from "mocha";
import Server from "./../src/server";

chai.use(chaiHttp);

describe("FoodItemTemplateRoute - API v1", () => {

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

  it("GET /api/v1/fooditemtemplate should pass if a token is provided", async () => {
    const accessToken = await login();
    const result = await chai.request(Server).get("/api/v1/fooditemtemplate").set("x-access-token", accessToken);
    expect(result.body).to.be.not.null;
    expect(result).to.be.json;
    expect(result).to.be.status(200);
  });

  it("GET /api/v1/fooditemtemplate should return all templates", async () => {
    const accessToken = await login();
    const result = await chai.request(Server).get("/api/v1/fooditemtemplate").set("x-access-token", accessToken);
    expect(result.body.length).to.equal(3);
  });

  it("GET /api/v1/fooditemtemplate/:id should return one template", async () => {
    const id = "59a2eea98a5a150e9e829409";
    const accessToken = await login();
    const result = await chai.request(Server).get(`/api/v1/fooditemtemplate/${id}`).set("x-access-token", accessToken);
    expect(result.body).to.not.null;
  });

  it("GET /api/v1/fooditemtemplate/:id should return one template w/ id, name, created & lastModified property",
    async () => {
      const id = "59a2eea98a5a150e9e829409";
      const token = await login();
      const result = await chai.request(Server).get(`/api/v1/fooditemtemplate/${id}`).set("x-access-token", token);
      expect(result.body).to.deep.property("id");
      expect(result.body).to.deep.property("name");
      expect(result.body).to.deep.property("created");
      expect(result.body).to.deep.property("lastModified");
    });

  it("PUT /api/v1/fooditemtemplate/:id should update the template and return the modified", async () => {
    const id = "59a2eea98a5a150e9e829409";
    const accessToken = await login();

    const resultBefore = await chai.request(Server)
      .get(`/api/v1/fooditemtemplate/${id}`)
      .set("x-access-token", accessToken);

    const resultAfter = await chai.request(Server)
      .put(`/api/v1/fooditemtemplate/${id}`)
      .set("x-access-token", accessToken)
      .set("Content-Type", "application/json")
      .send({ name: "milkXY"});

    expect(resultAfter.body.name).to.equal("milkXY");
    expect(resultAfter.body.name).to.not.equal(resultBefore.body.name);
    expect(resultAfter.body.lastModified).to.not.equal(resultBefore.body.lastModified);
  });

  it("POST /api/v1/fooditemtemplate should save a new template return it", async () => {
    const accessToken = await login();
    const result = await chai.request(Server)
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
    const accessToken = await login();
    const result = await chai.request(Server)
      .del(`/api/v1/fooditemtemplate/${id}`)
      .set("x-access-token", accessToken);
    expect(result.body.id).to.equal(id);
  });
});

/*tslint:enable:no-unused-expression*/
