import User from "../entities/User";
import { MyContext } from "../types";
import { Ctx, FieldResolver, Resolver, Root, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import RequestTable from "../entities/RequestTable";
import ClientFeed from "../entities/ClientFeed";

@Resolver(of => ClientFeed)
export default class ClientFeedResolver{
  
  @UseMiddleware(isAuth)
  @FieldResolver(() => User)
  async driver(
    @Root() { driver }: ClientFeed,
    @Ctx() { userLoader }: MyContext
  ): Promise<User | null>{  
    return userLoader.load(driver.id);
  }

  @UseMiddleware(isAuth)
  @FieldResolver(() => [RequestTable], { nullable: true })
  async request( 
    @Root() { request }: ClientFeed,
  ): Promise<RequestTable[] | null> {
    await request.init();
    return request.getItems();
  }
}