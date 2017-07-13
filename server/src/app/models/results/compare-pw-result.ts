import { SocoboUser } from "../../../socobouser/index";

export class ComparePwResult {

  constructor (
    public isPasswordMatch: boolean,
    public user: SocoboUser
  ) {}
}
