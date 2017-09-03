import { IsEmail, IsNotEmpty, MinLength, ValidateIf } from "class-validator";
import { Validatable, ValidationGroup } from "../../app/index";
import { SocoboUserProviderType, SocoboUserRoleType } from "../index";

export class SocoboUser implements Validatable {

  public id: string;

  @ValidateIf((o) => o.email === "", {
    groups: [ ValidationGroup.LOGIN ]
  })
  @IsNotEmpty({
    groups: [ ValidationGroup.LOGIN ]
  })
  @MinLength(5, {
    groups: [ ValidationGroup.LOGIN ]
  })
  @ValidateIf((o) => o.updateType === 1 || o.updateType === 0, {
    groups: [ ValidationGroup.USER ]
  })
  public username: string;

  @ValidateIf((o) => o.username === "", {
    groups: [ ValidationGroup.LOGIN ]
  })
  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  @IsEmail({}, {
    groups: [
      ValidationGroup.LOGIN,
      ValidationGroup.REGISTRATION
    ]
  })
  @ValidateIf((o) => o.updateType === 2 || o.updateType === 0, {
    groups: [ ValidationGroup.USER ]
  })
  public email: string;

  @IsNotEmpty({
    groups: [
      ValidationGroup.LOGIN,
      ValidationGroup.REGISTRATION
    ]
  })
  @MinLength(8, {
    groups: [
      ValidationGroup.LOGIN,
      ValidationGroup.REGISTRATION
    ]
  })
  @ValidateIf((o) => o.updateType === 3 || o.updateType === 0, {
    groups: [ ValidationGroup.USER ]
  })
  public password: string;

  public hasTermsAccepted: boolean;

  @ValidateIf((o) => o.updateType === 4 || o.updateType === 0, {
    groups: [ ValidationGroup.USER ]
  })
  @IsNotEmpty({
    groups: [ ValidationGroup.USER ]
  })
  public imageUrl: string;

  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  @ValidateIf((o) => o.updateType === 5 || o.updateType === 0, {
    groups: [ ValidationGroup.USER ]
  })
  @IsNotEmpty({
    groups: [ ValidationGroup.USER ]
  })
  public role: string;

  @ValidateIf((o) => o.updateType === 6 || o.updateType === 0, {
    groups: [ ValidationGroup.USER ]
  })
  @IsNotEmpty({
    groups: [ ValidationGroup.USER ]
  })
  public provider: string;

  @IsNotEmpty()
  public created: number;

  @IsNotEmpty()
  public lastModified: number;

  public setId = (id: string): this => {
    this.id = id;
    return this;
  }

  public setUsername = (username: string): this => {
    this.username = username;
    return this;
  }

  public setEmail = (email: string): this => {
    this.email = email;
    return this;
  }

  public setPassword = (password: string): this => {
    this.password = password;
    return this;
  }

  public setHasTermsAccepted = (hasTermsAccepted: boolean): this => {
    this.hasTermsAccepted = hasTermsAccepted;
    return this;
  }

  public setRole = (role: SocoboUserRoleType): this => {
    this.role = role;
    return this;
  }

  public setProvider = (provider: SocoboUserProviderType): this => {
    this.provider = provider;
    return this;
  }

  public setImageUrl = (imageUrl: string): this => {
    this.imageUrl = imageUrl;
    return this;
  }

  public setCreated = (created: number): this => {
    this.created = created;
    return this;
  }

  public setLastModified = (lastModified: number): this => {
    this.lastModified = lastModified;
    return this;
  }

  public clone = (socoboUser: SocoboUser): this => {
    this.username = socoboUser.username;
    this.email = socoboUser.email;
    this.password = socoboUser.password;
    this.hasTermsAccepted = socoboUser.hasTermsAccepted;
    this.role = socoboUser.role;
    this.provider = socoboUser.provider;
    this.imageUrl = socoboUser.imageUrl;
    this.createDates();
    return this;
  }

  public createDates = (): this => {
    const now = Date.now();
    this.created = now;
    this.lastModified = now;
    return this;
  }

  public removePassword = (): this => {
    delete this.password;
    return this;
  }

  public getSigningInfo = (): object => {
    return {
      email: this.email,
      provider: this.provider,
      role: this.role,
      username: this.username
    };
  }
}
