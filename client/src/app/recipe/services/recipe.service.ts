import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http"

import { Observable } from  "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { Recipe } from "./../model/recipe";

@Injectable()
export class RecipeService {

  private recipeBaseUrl = "localhost:8282/api/v1/recipes";
  private fake_toke = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQHRlc3QuY29tIiwicm9sZSI6MCwidXNlcm5hbWUiOiJ0ZXN0MUB0ZXN0LmNvbSIsImlhdCI6MTQ4OTkyMDczOCwiZXhwIjoxNDkwMDA3MTM4LCJpc3MiOiJzb2NvYm8ifQ.E-KPZbZa9IV4ldaHpuYPzm6LPEtjyuRkRSXrbLF3RL0";

  constructor(private http:Http) { }

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get(this.recipeBaseUrl)
      .map(this._extractBody)
      .catch(this._handleError);
  }

  private _extractBody(response: Response): any {
    return response.json();
  }

  private _handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.message || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
