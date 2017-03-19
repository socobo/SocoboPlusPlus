import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http"

import { Observable } from  "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";

import { Recipe } from "./../model/recipe";
import { FakeAuthService } from "./../../fake-auth.service";

@Injectable()
export class RecipeService {

  private recipeBaseUrl = "http://localhost:8282/api/v1/recipes";

  constructor(private http:Http, private authService: FakeAuthService) { }

  getAllRecipes(): Observable<Recipe[]> {
    let headers = new Headers({ 
      "Content-Type": "application/json" ,
      "x-access-token": this.authService.getToken()
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.recipeBaseUrl, options)
      .map(this._extractBody)
      .catch(this._handleError);
  }

  private _extractBody(response: Response): any {
    return response.json();
  }

  private _handleError(error: Response | any) {
    let errMsg = "An Error occured";
    if (error instanceof Response) {
      const body = error.json() || "";
      errMsg = body.message || errMsg;
    }
    return Observable.throw(errMsg);
  }

}
