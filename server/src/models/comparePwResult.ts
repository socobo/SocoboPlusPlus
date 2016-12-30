import { SocoboUser } from "./socobouser";


export class ComparePwResult {
  constructor (public isPasswordMatch: boolean, public user: SocoboUser) {}
}