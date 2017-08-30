/* tslint:disable:max-line-length */
export class Config {
  public static DB_USER: string = "";
  public static DB_PW: string = "";
  public static DB_URL_TEST: string = `mongodb://${Config.DB_USER}:${Config.DB_PW}@localhost:27017/socobo_test?ssl=false`;
  public static DB_URL_DEV: string = `mongodb://${Config.DB_USER}:${Config.DB_PW}@localhost:27017/socobo_dev?ssl=false`;
  public static DB_URL: string = `mongodb://${Config.DB_USER}:${Config.DB_PW}@localhost:27017/socobo?ssl=true`;
  public static PORT: number = 8282;
  public static NODE_ENV: string = "development";
  public static TOKEN_SECRET: string = "!*sdkfduf487387478478hhuhudf#28458//(/)##+993";
  public static TOKEN_EXPIRATION: string = "1d";
  public static TOKEN_ISSUER: string = "socobo";
  public static TOKEN_HEADER: string = "x-access-token";
  public static DEFAULT_USER_IMAGE_ID: number = 1;
  public static IMAGE_TMP_DIR: string = "tmp";
  public static DATA_BASE_DIR: string = "socobo_data";
}
/* tslint:enable:max-line-length */
