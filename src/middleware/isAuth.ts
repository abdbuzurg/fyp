import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN } from "../constants";
import { MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";

export const isAuth:MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.request.headers['authorization'];
  if (!authorization) {
    throw Error("Not authenticated");
  }

  try{
    const token = authorization.split(" ")[1];
    const payload = verify(token, ACCESS_TOKEN!);
    context.payload = payload as any;
  } catch(error) {
    throw Error("Not authenticated");
  }

  return next();
}