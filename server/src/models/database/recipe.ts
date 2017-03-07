import { IsNotEmpty, IsNumber, Length } from "class-validator";
import { SocoboUser } from "./../index";

export class Recipe {

  private fields: Map<string,Function>;

  public id: number;
  @IsNotEmpty()
  @Length(1, 50)
  public title: string;
  @IsNumber()
  public userId: number;
  public description: string;
  public imageUrl: string;
  public created: Date;
  public lastModified: Date;

  constructor() {
    this.fields = new Map(); 
    this.fields.set("title", this.addTitle);
    this.fields.set("userId", this.addUserId);
    this.fields.set("description", this.addDescription);
    this.fields.set("imageUrl", this.addImageUrl);
  }

  getFields() {
    return this.fields;
  }

  addTitle(title: string) {
    this.title = title;
    return this;
  }

  addUserId(userId: number) {
    this.userId = userId;
    return this;
  }

  addDescription(description: string) {
    this.description = description;
    return this;
  }

  addImageUrl(imageUrl: string) {
    this.imageUrl = imageUrl;
    return this;
  }

  addCreated(created: Date) {
    this.created = created;
    return this;
  }

  addLastModified(lastModified: Date) {
    this.lastModified = lastModified;
    return this;
  }

}

