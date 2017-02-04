import { Role } from "./../enums/role";

export class SocoboUser {
  public id: number;
  public username: string;
  public email: string;
  public password: string;
  public image: string;
  public hasTermsAccepted: boolean;
  public role: Role;
  public provider: string;
  public created: number;
  public lastModified: number;

  public addUsername = (username: string): this => {
    this.username = username;
    return this;
  }

  public addEmail = (email: string): this => {
    this.email = email;
    return this;
  }

  public addPassword = (password: string): this => {
    this.password = password;
    return this;
  }

  public addImage = (image: string): this => {
    this.image = image;
    return this;
  }

  public addHasTermsAccepted = (hasTermsAccepted: boolean): this => {
    this.hasTermsAccepted = hasTermsAccepted;
    return this;
  }

  public addRole = (role: Role): this => {
    this.role = role;
    return this;
  }

  public addProvider = (provider: string): this => {
    this.provider = provider;
    return this;
  }

  public addDates = (): this => {
    const now = Date.now();
    this.created = now;
    this.lastModified = now;
    return this;
  }
}
