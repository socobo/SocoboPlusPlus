import { IsNotEmpty, MinLength } from "class-validator";
import { ValidationGroup } from "./../enums/validation-group";
import { BaseObject } from "./BaseObject";

export class SocoboUserProvider extends BaseObject {

  public id: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.USER ]
  })
  @MinLength(1, {
    groups: [ ValidationGroup.USER ]
  })
  public name: string;

  constructor () { super(); }

  public addId = (id: number): this => {
    this.id = id;
    return this;
  }

  public addName = (name: string): this => {
    this.name = name;
    return this;
  }
}
