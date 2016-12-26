import { Router, Request, Response, NextFunction } from "express";

export interface Validation {
    addValidationsToRequest(req: Request): Request;
}