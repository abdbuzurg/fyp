import DriverFeed from "../entities/DriverFeed";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import RequestTable from "../entities/RequestTable";
import ClientFeed from "../entities/ClientFeed";

@Resolver(of => DriverFeed)
export default class FeedResolver{
  
  @Query(() => [DriverFeed])
  async fetchDriverFeed(@Ctx() { entityManager }: MyContext): Promise<DriverFeed[] | null> {
    return await entityManager.find(DriverFeed, {});
  }

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

  @UseMiddleware(isAuth)
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

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteDriverFeed(
    @Arg("id") id: number,
    @Ctx() { entityManager }: MyContext
  ): Promise<Boolean> {
    const driverFeed = await entityManager.findOne(DriverFeed, id);
    driverFeed!.deletedAt = new Date();
    await entityManager.persistAndFlush(driverFeed!);
    return true;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => ClientFeed, { nullable: true })
  async createClientFeed(
    @Arg("destination") destination: string,
    @Arg("pricing") pricing: number,
    @Arg("carModel") carModel: string,
    @Arg("numberOfSeats") numberOfSeats: number,
    @Arg("arrivalTime") arrivalTime: string,
    @Arg("departureDate") departureDate: string,
    @Ctx() { entityManager, request }: MyContext
  ): Promise<ClientFeed | null>{
    const clientFeed = entityManager.create(ClientFeed, {
      driver: request.session.userId,
      destination,
      pricing,
      carModel,
      numberOfSeats,
      arrivalTime,
      departureDate
    });

    await entityManager.persistAndFlush(clientFeed);
    return clientFeed;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => ClientFeed, { nullable: true })
  async updateClientFeed(
    @Arg("id") id: number,
    @Arg("destination", { nullable: true }) destination: string,
    @Arg("pricing", { nullable: true }) pricing: number,
    @Arg("carModel", { nullable: true }) carModel: string,
    @Arg("numberOfSeats", { nullable: true }) numberOfSeats: number,
    @Arg("arrivalTime", { nullable: true }) arrivalTime: string,
    @Arg("departureDate", { nullable: true }) departureDate: string,
    @Ctx() { entityManager, request }: MyContext
  ): Promise<ClientFeed | null>{
    const clientFeed = await entityManager.findOne(ClientFeed, id);

    if (!clientFeed) return null;
    if (typeof destination !== "undefined") clientFeed.destination = destination;
    if (typeof pricing !== "undefined") clientFeed.pricing = pricing;
    if (typeof carModel !== "undefined") clientFeed.carModel = carModel;
    if (typeof numberOfSeats !== "undefined") clientFeed.numberOfSeats = numberOfSeats;
    if (typeof arrivalTime !== "undefined") clientFeed.arrivalTime = arrivalTime;
    if (typeof departureDate !== "undefined") clientFeed.departureDate = departureDate;

    clientFeed.updatedAt = new Date();
    await entityManager.persistAndFlush(clientFeed);
    return clientFeed;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteClientFeed(
    @Arg("id") id: number,
    @Ctx() { entityManager }: MyContext
  ): Promise<Boolean> {
    const clientFeed = await entityManager.findOne(ClientFeed, id);
    clientFeed!.deletedAt = new Date();
    await entityManager.persistAndFlush(clientFeed!);
    return true;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => RequestTable, { nullable: true })
  async createRequest(
    @Arg("feedId") feedId: number,
    @Arg("feedType") feedType: number,
    @Ctx() { entityManager, request }: MyContext
  ): Promise<RequestTable | null>{
    const driverFeed = await entityManager.findOne(DriverFeed, feedId, { fields: ["client"]});
    const clientFeed = await entityManager.findOne(ClientFeed, feedId, { fields: ['driver']});

    let receiver: number;
    if (driverFeed !== null){
      receiver = driverFeed!.client.id;
    } else if (clientFeed !== null) {
      receiver = clientFeed!.driver.id;
    } else {
      return null;
    }

    const requestTable = entityManager.create(RequestTable, {
      sender: request.session.userId,
      receiver,
      feedType,
      requestStatus: 1,
      responseStatus: 1
    });   
    await entityManager.persistAndFlush(requestTable);

    if (feedType == 0) {
      driverFeed?.request.add(requestTable);
      await entityManager.persistAndFlush(driverFeed!);
    } else {
      clientFeed?.request.add(requestTable);
      await entityManager.persistAndFlush(clientFeed!);
    }

    return requestTable;
  }
}