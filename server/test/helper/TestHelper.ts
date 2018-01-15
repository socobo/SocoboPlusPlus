import * as chai from "chai";
import chaiHttp = require("chai-http");
import * as db from "../../src/db/index";
import { Recipe, RecipeCategory, RecipeIngredient } from "../../src/recipe/index";
import { SocoboUserRoleType } from "../../src/socobouser/index";
import Server from "./../../src/server";
import { recipeCategories, recipeIngredients, recipes } from "./index";

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

  public static setUpRecipesDb = () => {

    const cat1 = new RecipeCategory().clone(recipeCategories[0] as any);
    const cat2 = new RecipeCategory().clone(recipeCategories[1] as any);
    const cat3 = new RecipeCategory().clone(recipeCategories[2] as any);

    const ingr1 = new RecipeIngredient().clone(recipeIngredients[0] as any);
    const ingr2 = new RecipeIngredient().clone(recipeIngredients[1] as any);
    const ingr3 = new RecipeIngredient().clone(recipeIngredients[2] as any);

    const recipe1 = new Recipe().clone(recipes[0] as any);
    const recipe2 = new Recipe().clone(recipes[1] as any);
    const recipe3 = new Recipe().clone(recipes[2] as any);

    return Promise.all([
      db.recipe.deleteAll(),
      db.recipeCategory.deleteAll(),
      db.recipeIngredient.deleteAll()
    ]).catch((error) => {
      throw new Error("Clearing recipe collections failed");
    }).then(() => {
      return Promise.all([
        Promise.all([
          db.recipeCategory.save(cat1),
          db.recipeCategory.save(cat2),
          db.recipeCategory.save(cat3)
        ]).catch(() => {
          throw new Error("Saving recipe categories failed");
        }),
        Promise.all([
          db.recipeIngredient.save(ingr1),
          db.recipeIngredient.save(ingr2),
          db.recipeIngredient.save(ingr3)
        ]).catch(() => {
          throw new Error("Saving recipe ingreidents failed");
        }),
        Promise.all([
          db.recipe.save(recipe1),
          db.recipe.save(recipe2),
          db.recipe.save(recipe3)
        ]).catch(() => {
          throw new Error("Saving recipes failed");
        })
      ]);
    });
  }
}
