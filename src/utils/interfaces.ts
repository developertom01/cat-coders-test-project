import { Request, Response } from "express";
import User from "../app/models/User";

export type ResponseItem = Record<string, any>;

export interface IRequest<B = {}, P = {}, Q = {}>
  extends Request<P, never, B, Q> {
  user?: User;
}
export interface IResponse<R = ResponseItem | ResponseItem[] | string>
  extends Response<R> {}
