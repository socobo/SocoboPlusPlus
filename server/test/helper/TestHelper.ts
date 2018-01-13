import * as chai from "chai";
import chaiHttp = require("chai-http");
import { SocoboUserRoleType } from "../../src/socobouser/index";
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

  public static getToken = async (userRole: SocoboUserRoleType = SocoboUserRoleType.Admin,
                                  shouldOverrideToken: boolean = false): Promise<string|any> => {

    if (shouldOverrideToken) {
      TestHelper._token = null;
    }

    if (TestHelper._token) {
      return TestHelper._token;
    }

    try {
      const user = (userRole === SocoboUserRoleType.Admin)
        ? { email: "admin2@test.test", password: "password" }
        : { email: "john-doe@test.test", password: "SuperSecurePassword" };
      const result = await chai.request(Server).post("/api/v1/auth/login").send(user);
      TestHelper._token = result.body.token;
      return result.body.token;
    } catch (error) {
      return error;
    }
  }

  public static getTokenForEmailAndPassword = async (
    email: string,
    password: string,
    shouldOverrideToken: boolean = false, useTokenAsPw = true): Promise<string|any> => {

    if (shouldOverrideToken) {
    TestHelper._token = null;
    }

    if (TestHelper._token) {
    return TestHelper._token;
    }
    try {
      const result = await chai.request(Server)
      .post("/api/v1/auth/login").send({ email, password })
      .query({
        token: useTokenAsPw
      });
      TestHelper._token = result.body.token;
      return result.body.token;
    } catch (error) {
      return error;
    }
  }
}
