import DriverFeed from "../entities/DriverFeed";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";

@Resolver(of => DriverFeed)
export default class FeedResolver{
  @Mutation(() => DriverFeed)
  @UseMiddleware(isAuth)
  async createDriverFeed(
    @Arg("destination") destination: string,
    @Arg("pricing") pricing: number,
    @Arg("departureDate") departureDate: string,
    @Ctx() { entityManager, request }: MyContext
  ){
    const driverFeed = entityManager.create(DriverFeed, {
      client: request.session.userId,
      destination,
      pricing,
      departureDate,
    });

    await entityManager.persistAndFlush(driverFeed);
    return driverFeed;
  }
}