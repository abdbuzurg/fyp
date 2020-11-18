import RequestTable from "../entities/RequestTable";
import { Ctx, FieldResolver, Resolver, Root, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import User from "../entities/User";

@Resolver(of => RequestTable)
export default class RequestResolver{

  @UseMiddleware(isAuth)
  @FieldResolver(() => User)
  async sender(
    @Root() { sender }: RequestTable,
    @Ctx() { entityManager}: MyContext
  ): Promise<User | null>{
    return await entityManager.findOne(User, sender);
  }

  @UseMiddleware(isAuth)
  @FieldResolver(() => User)
  async reciever(
    @Root() { reciever }: RequestTable,
    @Ctx() { entityManager}: MyContext
  ): Promise<User | null>{
    return await entityManager.findOne(User, reciever);
  }
}