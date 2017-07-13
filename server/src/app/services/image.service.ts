import { DataType } from "../index";

export interface ImageService {

  persistImage (sourceFile: string, dataType: DataType, userIdentifier: string): Promise<any>;

}
