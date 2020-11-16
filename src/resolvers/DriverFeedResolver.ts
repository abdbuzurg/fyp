import DriverFeed from "../entities/DriverFeed";
import User from "../entities/User";
import { MyContext } from "../types";
import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";

@Resolver(of => DriverFeed)
export default class DriverFeedResolver{
  
  @FieldResolver(() => User)
  async client(
    @Root() { client }: DriverFeed,
    @Ctx() { entityManager }: MyContext
  ): Promise<User | null>{
    const user = await entityManager.findOne(User, client);
    return user;
  }

}