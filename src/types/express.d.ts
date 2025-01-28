import { User } from "../entities/User";

console.log(User);
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
