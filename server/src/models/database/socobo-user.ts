import { ProviderType } from "./../enums/provider-type";

export class SocoboUser {
  public id: number;
  public username: string;
  public email: string;
  public password: string;
  public image: string;
  public hasTermsAccepted: boolean;
  public isAdmin: boolean;
  public provider: ProviderType;
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

  public addIsAdmin = (isAdmin: boolean): this => {
    this.isAdmin = isAdmin;
    return this;
  }

  public addProvider = (provider: ProviderType): this => {
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
