import { MyContext } from 'src/types';
import { Resolver, Query, Ctx, Int, Arg, Mutation } from 'type-graphql';
import User from '../entities/User';
import argon from 'argon2';
import { COOKIE_NAME } from '../constants';

@Resolver()
export default class UserResolver{
  @Query(() => [User])
  async users(@Ctx() { entityManager }: MyContext): Promise<User[]>{
    return await entityManager.find(User, { deletedAt: null});
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id", () => Int) id: number, @Ctx() { entityManager }: MyContext) {
    return await entityManager.findOne(User, { id });
  }

  @Mutation(() => User, { nullable: true }) 
  async register(
    @Arg("email") email: string,
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Arg("name") name: string,
    @Arg("mobileNumber") mobileNumber: string,
    @Ctx() { entityManager, knex }: MyContext
  ): Promise<User | null> {
    //checking if the giver USERNAME, EMAIL and MOBILE_NUMBR are taken already
    const taken = await knex("user").where({ username }).orWhere({ mobile_number: mobileNumber }).orWhere({ email });
    if (taken.length > 0){
      return null;
    }
    const hashedPassword = await argon.hash(password);
    const user = entityManager.create(User, {
      email,
      username,
      password: hashedPassword,
      name,
      mobileNumber,
    });
    await entityManager.persistAndFlush(user);
    return user;
  }

  @Query(() => Boolean, { nullable: true })
  async login(
    @Arg("email", { nullable: true }) email: string,
    @Arg("username", { nullable: true }) username: string,
    @Arg("password") password: string,
    @Ctx() { entityManager, request }: MyContext
  ):Promise<Boolean | null> {
    let user: User | null;
    if (typeof email !== "undefined") {
      user = await entityManager.findOne(User, { email, deletedAt: null, });;
    } else if (typeof username !== "undefined") {
      user = await entityManager.findOne(User, { username, deletedAt: null, });
    } else {
      return null;
    }
    if (!user) return null;
    if (!await argon.verify(user.password, password)) return null;
    request.session.userId = user.id;
    return true;
  }

  @Mutation(() => User, { nullable: true }) 
  async updateUser(
    //@Arg("id", { nullable: true }) id: number,  <-- need to be made for the cases if the SuperUser requests it.
    @Arg("email", { nullable: true}) email: string,
    @Arg("username", { nullable: true}) username: string,
    @Arg("password", { nullable: true}) password: string,
    @Arg("name", { nullable: true}) name: string,
    @Arg("mobileNumber", { nullable: true}) mobileNumber: string,
    @Ctx() { request, entityManager }: MyContext
  ): Promise<User | null> {
    if (typeof request.session.userId === "undefined"){
      return null;
    }
    const user = await entityManager.findOne(User, { id: request.session.userId });
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
    await entityManager.persistAndFlush(user);
    return user;
  }

  @Mutation(() => Boolean, { nullable: true }) 
  async deleteUser(
    @Arg("id") id: number,
    @Ctx() { entityManager }: MyContext
  ): Promise<Boolean | null> {
    const user = await entityManager.findOne(User, { id });
    if (!user) {
      return null;
    }
    user.deletedAt = new Date();
    await entityManager.persistAndFlush(user);
    return true;
  }

  @Mutation(() => Boolean, { nullable: true })
  logout(@Ctx() {request, response}: MyContext){
    return new Promise(resolve => 
      request.session.destroy((error) => {
        if (error) {
          console.log(error);
          resolve(false);
        }

        response.clearCookie(COOKIE_NAME);
        resolve(true);
    }));
  }
}