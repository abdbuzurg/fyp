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
    @Ctx() { userLoader, entityManager }: MyContext
  ): Promise<User | null>{
    return userLoader.load(sender.id);
    
  }

  @UseMiddleware(isAuth)
  @FieldResolver(() => User)
  async reciever(
    @Root() { receiver }: RequestTable,
    @Ctx() { userLoader, entityManager }: MyContext
  ): Promise<User | null>{
    return userLoader.load(receiver.id);
    
  }
}