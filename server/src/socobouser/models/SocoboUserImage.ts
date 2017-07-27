import { IsNotEmpty, IsUrl, MinLength } from "class-validator";
import { BaseObject, ValidationGroup } from "../../app/index";

export class SocoboUserImage extends BaseObject {

  public id: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.USER ]
  })
  @IsUrl({}, {
    groups: [ ValidationGroup.USER ]
  })
  @MinLength(1, {
    groups: [ ValidationGroup.USER ]
  })
  public url: string;

  constructor () { super(); }

  public setId = (id: number): this => {
    this.id = id;
    return this;
  }

  public setUrl= (url: string): this => {
    this.url = url;
    return this;
  }
}
