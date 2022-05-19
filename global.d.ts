import User from "./src/app/models/User";

declare module "Express" {
  interface Request {
    user?: User;
  }
}
