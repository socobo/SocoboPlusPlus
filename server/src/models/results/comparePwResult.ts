import { SocoboUser } from "./../database/socobouser";

export class ComparePwResult {
  constructor (public isPasswordMatch: boolean, public user: SocoboUser) {}
}