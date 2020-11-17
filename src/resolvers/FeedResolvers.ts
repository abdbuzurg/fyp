import DriverFeed from "../entities/DriverFeed";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";

@Resolver(of => DriverFeed)
export default class FeedResolver{
  
  @Mutation(() => DriverFeed, { nullable: true })
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

  @Mutation(() => DriverFeed, { nullable: true})
  async updateDriverFeed(
    @Arg("id") id: number,
    @Arg("destination", { nullable: true }) destination: string,
    @Arg("pricing", { nullable: true }) pricing: number,
    @Arg("departureDate", { nullable: true }) departureDate: string,
    @Ctx() { entityManager, request }: MyContext
  ): Promise<DriverFeed | null> {
    const driverFeedPost = await entityManager.findOne(DriverFeed, id);
    
    if (!driverFeedPost) return null;
    if (driverFeedPost.client.id !== request.session.userId) return null;

    if (typeof destination !== "undefined") driverFeedPost.destination = destination;
    if (typeof pricing !== "undefined") driverFeedPost.pricing = pricing;
    if (typeof departureDate !== "undefined") driverFeedPost.departureDate = departureDate;

    driverFeedPost.updatedAt = new Date();
    await entityManager.persistAndFlush(driverFeedPost);
    return driverFeedPost;
  }
}