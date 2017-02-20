import { DbConfig } from "./models/index";

export class Config {
  public static DB_USER: string = "postgres";
  public static DB_PW: string = "socobo";
  public static DB_CONFIG_TEST: DbConfig = {
    database: "socobo_test",
    host: "localhost",
    password: "socobo",
    port: 5432,
    user: "postgres"
  };
  public static DB_CONFIG_DEV: DbConfig = {
    database: "socobo_dev",
    host: "localhost",
    password: "socobo",
    port: 5432,
    user: "postgres"
  };
  public static DB_CONFIG: DbConfig = {
    database: "socobo",
    host: "localhost",
    password: "socobo",
    port: 5432,
    user: "postgres"
  };
  public static PORT: number = 8282;
  public static NODE_ENV: string = "development";
  public static TOKEN_SECRET: string = "!*sdkfduf487387478478hhuhudf#28458//(/)##+993";
  public static TOKEN_EXPIRATION: string = "1d";
  public static TOKEN_ISSUER: string = "socobo";
  public static TOKEN_HEADER: string = "x-access-token";
  public static DEFAULT_USER_IMAGE: string = "http://placehold.it/350x150";
}
