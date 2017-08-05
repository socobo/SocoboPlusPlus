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
  @ValidateIf((o) => o.updateType === 1, {
    groups: [ ValidationGroup.USER ]
  })
  @IsNotEmpty({
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

  public setId = (id: number): this => {
    this.id = id;
    return this;
  }

  public setSocoboUserRoleId = (id: number): this => {
    this.socoboUserRoleId = id;
    return this;
  }

  public setSocoboUserProviderId = (id: number): this => {
    this.socoboUserProviderId = id;
    return this;
  }

  public setSocoboUserImageId = (id: number): this => {
    this.socoboUserImageId = id;
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
