import { SocoboUser } from "./../index";

export class ComparePwResult {
  constructor (public isPasswordMatch: boolean, public user: SocoboUser) {}
}