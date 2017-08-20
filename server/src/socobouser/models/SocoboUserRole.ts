import { IsNotEmpty, MinLength } from "class-validator";
import { BaseObject, ValidationGroup } from "../../app/index";

// TODO: remove this class --> now integrated into socobouser collection
export class SocoboUserRole extends BaseObject {

  public id: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.USER ]
  })
  @MinLength(1, {
    groups: [ ValidationGroup.USER ]
  })
  public name: string;

  constructor () { super(); }

  public setId = (id: number): this => {
    this.id = id;
    return this;
  }

  public setName = (name: string): this => {
    this.name = name;
    return this;
  }
}
