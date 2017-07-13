import { IsEmail, IsNotEmpty, MinLength, ValidateIf } from "class-validator";
import { BaseObject, ValidationGroup } from "../../app/index";

export class SocoboUser extends BaseObject {

  public id: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  public socoboUserRoleId: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  public socoboUserProviderId: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  public socoboUserImageId: number;

  @ValidateIf((o) => o.email === "", {
    groups: [ ValidationGroup.LOGIN ]
  })
  @IsNotEmpty({
    groups: [ ValidationGroup.LOGIN ]
  })
  @MinLength(5, {
    groups: [ ValidationGroup.LOGIN ]
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
  public password: string;

  public hasTermsAccepted: boolean;

  constructor () { super(); }

  public addId = (id: number): this => {
    this.id = id;
    return this;
  }

  public addSocoboUserRoleId = (id: number): this => {
    this.socoboUserRoleId = id;
    return this;
  }

  public addSocoboUserProviderId = (id: number): this => {
    this.socoboUserProviderId = id;
    return this;
  }

  public addSocoboUserImageId = (id: number): this => {
    this.socoboUserImageId = id;
    return this;
  }

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

  public addHasTermsAccepted = (hasTermsAccepted: boolean): this => {
    this.hasTermsAccepted = hasTermsAccepted;
    return this;
  }

  public getSigningInfo = (): Object => {
    return {
      email: this.email,
      image: this.socoboUserImageId,
      provider: this.socoboUserProviderId,
      role: this.socoboUserRoleId,
      username: this.username
    };
  }
}
