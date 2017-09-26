import { SocoboUser } from "../../../socobouser/index";

export class LoginResponse {

  constructor (
    private token: string,
    private socobouser: SocoboUser
  ) {}
}
