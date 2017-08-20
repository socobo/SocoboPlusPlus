import { IsEmail, IsNotEmpty, MinLength, ValidateIf } from "class-validator";
import { prop, Typegoose } from "typegoose";
import { ValidationGroup, Validatable } from "../../app/index";
import { SocoboUserRoleType, SocoboUserProviderType } from "../index";

export class SocoboUser extends Typegoose implements Validatable {
  
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
  @prop()
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
  @prop()
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
  @prop({ required: true })
  public password: string;
  
  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  @prop()
  public hasTermsAccepted: boolean;
  
  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  @prop()
  public role: string;

  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  @prop()
  public provider: string;

  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  @prop()
  public imageUrl: string;

  @IsNotEmpty()
  @prop({ required: true, default: Date.now })
  public created: number;

  @IsNotEmpty()
  @prop({ required: true, default: Date.now })
  public lastModified: number;

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
    this.setUsername(socoboUser.username);
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

  public getSigningInfo = (): object => {
    return {
      email: this.email,
      provider: this.provider,
      role: this.role,
      username: this.username
    };
  }
}