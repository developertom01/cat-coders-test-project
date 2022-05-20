import { NextFunction } from "express";
import { CustomError } from "../../../utils/Errors";
import { HttpErrorStatusCodes } from "../../../utils/HttpStatusCodes";
import { IRequest, IResponse } from "../../../utils/interfaces";

const middleware = (
  error: Error | CustomError,
  req: IRequest,
  res: IResponse,
  next: NextFunction
) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(error);
  }
  if (error instanceof CustomError) {
    res.status(error.status).json(error.serialize());
  } else {
    res.status(HttpErrorStatusCodes.SERVER_ERROR).json({
      errors: [
        {
          message: error.message,
        },
      ],
    });
  }
};
export default middleware;
