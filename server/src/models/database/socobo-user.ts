export class SocoboUser {
  id: number; 
  username: string; 
  email: string;
  password: string; 
  image: string; 
  hasTermsAccepted: boolean; 
  isAdmin: boolean; 
  provider: string;
  created: number;
  lastModified: number;

  addUsername = (username: string): this => {
    this.username = username;
    return this;
  }

  addEmail = (email: string): this => {
    this.email = email;
    return this;
  }

  addPassword = (password: string): this => {
    this.password = password;
    return this;
  }

  addImage = (image: string): this => {
    this.image = image;
    return this;
  }

  addHasTermsAccepted = (hasTermsAccepted: boolean): this => {
    this.hasTermsAccepted = hasTermsAccepted;
    return this;
  }

  addIsAdmin = (isAdmin: boolean): this => {
    this.isAdmin = isAdmin;
    return this;
  }

  addProvider = (provider: string): this => {
    this.provider = provider;
    return this;
  }

  addDates = (): this => {
    const now = Date.now();
    this.created = now;
    this.lastModified = now;
    return this;
  }
}