import { IsNotEmpty } from "class-validator";

export class BaseObject {

  @IsNotEmpty()
  public created: number;

  @IsNotEmpty()
  public lastModified: number;

  public setCreated = (created: number): this => {
    this.created = created;
    return this;
  }

  public setLastModified = (lastModified: number): this => {
    this.lastModified = lastModified;
    return this;
  }

  public createDates = (): this => {
    const now = Date.now();
    this.created = now;
    this.lastModified = now;
    return this;
  }
}
