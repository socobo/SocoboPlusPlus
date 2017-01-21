import { SocoboUser } from "./../index";

export class LoginResponse {

  constructor (
    private token: string,
    private user: SocoboUser
  ) {}
}
