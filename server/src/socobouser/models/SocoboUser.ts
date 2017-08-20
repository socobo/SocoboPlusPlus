import { IsEmail, IsNotEmpty, MinLength, ValidateIf } from "class-validator";
import { prop, Typegoose } from "typegoose";
import { ValidationGroup } from "../../app/index";
import { SocoboUserRoleType, SocoboUserProviderType } from "../index";

export class SocoboUser extends Typegoose {

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
  username?: string;

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
  email?: string;

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
  password: string;
  
  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  @prop()
  hasTermsAccepted: boolean;
  
  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  @prop()
  role: string;

  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  @prop()
  provider: string;

  @IsNotEmpty({
    groups: [ ValidationGroup.REGISTRATION ]
  })
  @prop()
  imageUrl: string;

  @IsNotEmpty()
  @prop({ required: true, default: Date.now })
  created: number;

  @IsNotEmpty()
  @prop({ required: true, default: Date.now })
  lastModified: number;



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