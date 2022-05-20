import { CelebrateError } from "celebrate";
import { CustomError } from "../../../utils/Errors";
import { HttpErrorStatusCodes } from "../../../utils/HttpStatusCodes";
import { IRequest, IResponse } from "../../../utils/interfaces";

const middleware = (error: Error, req: IRequest, res: IResponse) => {
  if (error instanceof CelebrateError) {
    return res.status(HttpErrorStatusCodes.BAD_REQUEST).json(error);
  }
  if (error instanceof CustomError) {
    return res.status(error.status).json(error.serialize());
  }
  return res.status(HttpErrorStatusCodes.SERVER_ERROR).json(error.message);
};
export default middleware;
