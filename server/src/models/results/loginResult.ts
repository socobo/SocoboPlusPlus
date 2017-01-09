import { SocoboUser } from "./../database/socoboUser";


export class LoginResult {
  private token: string;
  private user: SocoboUser;

  constructor (token: string, user: SocoboUser) {
    this.token = token;
    this.user = user;
  }
}