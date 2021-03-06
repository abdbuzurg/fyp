import DriverFeed from "../entities/DriverFeed";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import RequestTable from "../entities/RequestTable";
import ClientFeed from "../entities/ClientFeed";

@Resolver()
export default class FeedResolver{

  @UseMiddleware(isAuth)
  @Query(() => [DriverFeed])
  async fetchDriverFeed(@Ctx() { entityManager }: MyContext): Promise<DriverFeed[] | null> {
    return (await entityManager.find(DriverFeed, {})).reverse();
  }

  @UseMiddleware(isAuth)
  @Query(() => [DriverFeed])
  async fetchDriverFeedById(
    @Arg("id") id: number,
    @Ctx() { entityManager }: MyContext
  ): Promise<DriverFeed | null> {
    return await entityManager.findOne(DriverFeed, id);
  }

  @Mutation(() => DriverFeed, { nullable: true })
  @UseMiddleware(isAuth)
  async createDriverFeed(
    @Arg("initialLocation") initialLocation: string,
    @Arg("finalLocation") finalLocation: string,
    @Arg("pricing") pricing: string,
    @Arg("description") description: string,
    @Arg("departureDate") departureDate: string,
    @Ctx() { entityManager, payload }: MyContext
  ){
    const driverFeed = entityManager.create(DriverFeed, {
      client: payload.userId,
      description,
      initialLocation,
      finalLocation,
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
    @Arg("initialLocation", { nullable: true }) initialLocation: string,
    @Arg("finalLocation", { nullable: true }) finalLocation: string,
    @Arg("pricing", { nullable: true }) pricing: string,
    @Arg("description", { nullable: true }) description: string,
    @Arg("departureDate", { nullable: true }) departureDate: string,
    @Ctx() { entityManager, payload }: MyContext
  ): Promise<DriverFeed | null> {
    const driverFeedPost = await entityManager.findOne(DriverFeed, id);
    
    if (!driverFeedPost) return null;
    if (driverFeedPost.client.id !== payload.userId) return null;

    if (typeof description !== "undefined") driverFeedPost.description = description;
    if (typeof initialLocation !== "undefined") driverFeedPost.initialLocation = initialLocation;
    if (typeof finalLocation !== "undefined") driverFeedPost.finalLocation = finalLocation;
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
  @Query(() => [ClientFeed])
  async fetchClientFeed(@Ctx() { entityManager }: MyContext): Promise<ClientFeed[] | null>{
    return (await entityManager.find(ClientFeed, { deletedAt: null })).reverse();
  }

  @UseMiddleware(isAuth)
  @Query(() => ClientFeed)
  async fetchClientFeedById(
    @Arg("id") id: number,
    @Ctx() { entityManager }: MyContext
  ): Promise<ClientFeed| null>{
    return await entityManager.findOne(ClientFeed, id);
  }

  @UseMiddleware(isAuth)
  @Mutation(() => ClientFeed, { nullable: true })
  async createClientFeed(
    @Arg("initialLocation") initialLocation: string,
    @Arg("finalLocation") finalLocation: string,
    @Arg("pricing") pricing: string,
    @Arg("carModel") carModel: string,
    @Arg("numberOfSeats") numberOfSeats: string,
    @Arg("description") description: string,
    @Arg("departureDate") departureDate: string,
    @Ctx() { entityManager, payload }: MyContext
  ): Promise<ClientFeed | null>{
    console.log(payload.userId);
    const clientFeed = entityManager.create(ClientFeed, {
      driver: +payload.userId,
      description,
      initialLocation,
      finalLocation,
      pricing,
      carModel,
      numberOfSeats,
      departureDate
    });

    await entityManager.persistAndFlush(clientFeed);
    return clientFeed;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => ClientFeed, { nullable: true })
  async updateClientFeed(
    @Arg("id") id: number,
    @Arg("initialLocation", { nullable: true }) initialLocation: string,
    @Arg("finalLocation", { nullable: true }) finalLocation: string,
    @Arg("pricing", { nullable: true }) pricing: string,
    @Arg("carModel", { nullable: true }) carModel: string,
    @Arg("numberOfSeats", { nullable: true }) numberOfSeats: string,
    @Arg("description", { nullable: true }) description: string,
    @Arg("departureDate", { nullable: true }) departureDate: string,
    @Ctx() { entityManager, payload }: MyContext
  ): Promise<ClientFeed | null>{
    const clientFeed = await entityManager.findOne(ClientFeed, id);

    if (!clientFeed) return null;
    if (typeof description !== "undefined") clientFeed.description = description;
    if (typeof initialLocation !== "undefined") clientFeed.initialLocation = initialLocation;
    if (typeof finalLocation !== "undefined") clientFeed.finalLocation = finalLocation;
    if (typeof carModel !== "undefined") clientFeed.carModel = carModel;
    if (typeof numberOfSeats !== "undefined") clientFeed.numberOfSeats = numberOfSeats;
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
    @Ctx() { entityManager, payload }: MyContext
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
      sender: payload.userId,
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

  @UseMiddleware(isAuth)
  @Query(() => [RequestTable])
  async allRequstOfAClientFeed(
    @Arg("clientFeedId") clientFeedId: number,
    @Ctx() { entityManager }:MyContext
  ): Promise<RequestTable[] | undefined | null> {
    const clientFeed = await entityManager.findOne(ClientFeed, clientFeedId);
    await clientFeed?.request.init();
    return clientFeed?.request.getItems();
  }
}