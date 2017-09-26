import { Request, Response } from "express";
import { LogService } from "../index";

export class LogHandler {

  public getErrors = (req: Request, res: Response): void => {
    res.status(200).json(LogService.getErrors());
  }
}
