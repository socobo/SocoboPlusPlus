import { IsNotEmpty } from "class-validator";

export class BaseObject {

  @IsNotEmpty()
  public created: number;

  @IsNotEmpty()
  public lastModified: number;

  public addCreated = (created: number): this => {
    this.created = created;
    return this;
  }

  public addLastModified = (lastModified: number): this => {
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