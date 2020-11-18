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
    @Ctx() { entityManager }: MyContext
  ): Promise<User | null>{
    return await entityManager.findOne(User, client);
  }

  @UseMiddleware(isAuth)
  @FieldResolver(() => [RequestTable])
  async request(
    @Root() { request }: DriverFeed,
    @Ctx() { entityManager }: MyContext
  ): Promise<RequestTable[] | null> {
    const requests = await request.init();
    console.log(requests);
    return null;
  }
}