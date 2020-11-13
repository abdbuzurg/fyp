import { MyContext } from 'src/types';
import { Resolver, Query, Ctx, Int, Arg, Mutation } from 'type-graphql';
import User from '../entities/User';

@Resolver()
export default class HelloResolver{
  @Query(() => [User])
  async users(@Ctx() { entity }: MyContext): Promise<User[]>{
    return await entity.em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id", () => Int) id: number, @Ctx() { entity }: MyContext) {
    return await entity.em.findOne(User, { id });
  }

  @Mutation(() => User, { nullable: true }) 
  async createUser(
    @Arg("email") email: String,
    @Arg("username") username: String,
    @Arg("password") password: String,
    @Arg("name") name: String,
    @Arg("mobileNumber") mobileNumber: String,
    @Ctx() { entity }: MyContext
  ): Promise<User | null> {
    const user = entity.em.create(User, {
      email,
      username,
      password,
      name,
      mobileNumber,
    });
    await entity.em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => User, { nullable: true }) 
  async updateUser(
    @Arg("id") id: number,
    @Arg("email", { nullable: true}) email: String,
    @Arg("username", { nullable: true}) username: String,
    @Arg("password", { nullable: true}) password: String,
    @Arg("name", { nullable: true}) name: String,
    @Arg("mobileNumber", { nullable: true}) mobileNumber: String,
    @Ctx() { entity }: MyContext
  ): Promise<User | null> {
    const user = await entity.em.findOne(User, { id });
    if (!user) {
      return null
    } 
    if (typeof email !== "undefined") user.email = email
    if (typeof username !== "undefined") user.username = username
    if (typeof password !== "undefined") user.password = password
    if (typeof name !== "undefined") user.name = name
    if (typeof email !== "undefined") user.email = email
    if (typeof mobileNumber !== "undefined") user.mobileNumber = mobileNumber

    user.updatedAt = new Date();
    await entity.em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => Boolean, { nullable: true }) 
  async deleteUser(
    @Arg("id") id: number,
    @Ctx() { entity }: MyContext
  ): Promise<Boolean | null> {
    const user = await entity.em.findOne(User, { id });
    if (!user) {
      return null;
    }
    user.deletedAt = new Date();
    await entity.em.persistAndFlush(user);
    return true;
  }
}