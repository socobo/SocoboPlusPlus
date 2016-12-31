export class Config {
  static DB_USER: string = "postgres";
  static DB_PW: string = "socobo";
  static DATABASE_URL: string = `postgres://${Config.DB_USER}:${Config.DB_PW}@localhost:5432/socobo?ssl=false`;
  static PORT: number = 8282;
  static NODE_ENV: string = "development";
  static TOKEN_SECRET: string = "!*sdkfduf487387478478hhuhudf#28458//(/)##+993";
  static TOKEN_EXPIRATION: string = "1d";
  static TOKEN_HEADER: string = "x-access-token";
}