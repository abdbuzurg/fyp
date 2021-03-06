import DriverFeed from "../entities/DriverFeed";
import User from "../entities/User";
import { MyContext } from "../types";
import { Ctx, FieldResolver, Resolver, Root, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import RequestTable from "../entities/RequestTable";

@Resolver(of => DriverFeed)
export default class DriverFeedResolver{
  
  @UseMiddleware(isAuth)
  @FieldResolver(() => User)
  async client(
    @Root() { client }: DriverFeed,
    @Ctx() { userLoader }: MyContext
  ): Promise<User | null>{  
    return userLoader.load(client.id);
  }

  @UseMiddleware(isAuth)
  @FieldResolver(() => [RequestTable], { nullable: true })
  async request(
    @Root() { request }: DriverFeed,
  ): Promise<RequestTable[] | null> {
    await request.init();
    return request.getItems();
  }
}