import { IsEmail, IsNotEmpty, MinLength, ValidateIf } from "class-validator";
import { Validatable, ValidationGroup } from "../../app/index";
import { SocoboUserProviderType, SocoboUserRoleType, SocoboUserUpdateType } from "../index";

export class SocoboUser implements Validatable {

  private _updateType: SocoboUserUpdateType;

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
  @ValidateIf((o) => o._updateType === 1 || o._updateType === 0, {
    groups: [ ValidationGroup.USER ]
  })
  @IsNotEmpty({
    groups: [ ValidationGroup.USER ]
  })
  @MinLength(5, {
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
  @ValidateIf((o) => o._updateType === 2 || o._updateType === 0, {
    groups: [ ValidationGroup.USER ]
  })
  @IsNotEmpty({
    groups: [ ValidationGroup.USER ]
  })
  @IsEmail({}, {
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
  @ValidateIf((o) => o._updateType === 3 || o._updateType === 0, {
    groups: [ ValidationGroup.USER ]
  })
  @IsNotEmpty({
    groups: [ ValidationGroup.USER ]
  })
  @MinLength(8, {
    groups: [ ValidationGroup.USER ]
  })
  public password: string;

  public hasTermsAccepted: boolean;

  @ValidateIf((o) => o._updateType === 4 || o._updateType === 0, {
    groups: [ ValidationGroup.USER ]
  })
  @IsNotEmpty({
    groups: [ ValidationGroup.USER ]
  })
  public imageUrl: string;

  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  @ValidateIf((o) => o._updateType === 5 || o._updateType === 0, {
    groups: [ ValidationGroup.USER ]
  })
  @IsNotEmpty({
    groups: [ ValidationGroup.USER ]
  })
  public role: string;

  @ValidateIf((o) => o._updateType === 6 || o._updateType === 0, {
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

  public clone = (obj: any): this => {
    const tmp = obj.hasOwnProperty("fieldsToUpdate") ? obj.fieldsToUpdate : obj;
    this.username = tmp.username;
    this.email = tmp.email;
    this.password = tmp.password;
    this.hasTermsAccepted = tmp.hasTermsAccepted;
    this.role = tmp.role;
    this.provider = tmp.provider;
    this.imageUrl = tmp.imageUrl;
    this.createDates();
    if (obj.hasOwnProperty("updateType")) {
      this._updateType = obj.updateType as SocoboUserUpdateType;
    }
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
