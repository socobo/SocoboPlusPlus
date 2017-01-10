import { SocoboUser } from "./../index";

export class LoginResponse {
  private token: string;
  private user: SocoboUser;

  constructor (token: string, user: SocoboUser) {
    this.token = token;
    this.user = user;
  }
}