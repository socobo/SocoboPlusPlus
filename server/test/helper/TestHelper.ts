import * as chai from "chai";
import chaiHttp = require("chai-http");
import Server from "./../../src/server";

chai.use(chaiHttp);

export class TestHelper {

  private static _agent: ChaiHttp.Agent;
  private static _token: string;

  public static getAgent = (): ChaiHttp.Agent => {
    if (TestHelper._agent) {
      return TestHelper._agent;
    }
    return chai.request(Server);
  }

  public static getToken = async (): Promise<string|any> => {
    if (TestHelper._token) {
      return TestHelper._token;
    }
    try {
      const user = { email: "admin2@test.test", password: "password" };
      const result = await chai.request(Server).post("/api/v1/auth/login").send(user);
      TestHelper._token = result.body.token;
      return result.body.token;
    } catch (error) {
      return error;
    }
  }
}
