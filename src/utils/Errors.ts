import { HttpErrorStatusCodes } from "./HttpStatusCodes";

export interface ErrorSerializer {
  errors: {
    message: string | string;
  }[];
}

export abstract class CustomError extends Error {
  public abstract reason: string | string[];

  constructor(
    public message: string,
    public readonly status: HttpErrorStatusCodes
  ) {
    super(message);
  }
  public abstract serialize(): ErrorSerializer;
}

class NotFoundError extends CustomError {
  public reason: string;
  constructor(message: string) {
    super(message, HttpErrorStatusCodes.NOTFOUND);
    this.reason = message;
  }
  public serialize() {
    return {
      errors: [
        {
          message: this.reason,
        },
      ],
    };
  }
}
class BadRequestError extends CustomError {
  public reason: string;
  constructor(message: string) {
    super(message, HttpErrorStatusCodes.BAD_REQUEST);
    this.reason = message;
  }
  public serialize() {
    return {
      errors: [
        {
          message: this.reason,
        },
      ],
    };
  }
}
class UnAuthorizeError extends CustomError {
  public reason: string;
  constructor(message: string) {
    super(message, HttpErrorStatusCodes.UNAUTHORIZE);
    this.reason = message;
  }
  public serialize() {
    return {
      errors: [
        {
          message: this.reason,
        },
      ],
    };
  }
}
class ForbiddenError extends CustomError {
  public reason: string;
  constructor(message: string) {
    super(message, HttpErrorStatusCodes.FORBIDDEN);
    this.reason = message;
  }
  public serialize() {
    return {
      errors: [
        {
          message: this.reason,
        },
      ],
    };
  }
}
class ServerError extends CustomError {
  public reason: string;
  constructor(message: string) {
    super(message, HttpErrorStatusCodes.SERVER_ERROR);
    this.reason = message;
  }
  public serialize() {
    return {
      errors: [
        {
          message: this.reason,
        },
      ],
    };
  }
}

export const HTTPErrors = {
  NotFoundError,
  BadRequestError,
  UnAuthorizeError,
  ForbiddenError,
  ServerError,
};
