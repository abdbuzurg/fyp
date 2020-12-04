import { MyContext } from '../types';
import { Resolver, Query, Ctx, Int, Arg, Mutation, ObjectType, Field } from 'type-graphql';
import User from '../entities/User';
import argon from 'argon2';
import { COOKIE_NAME } from '../constants';
import { createAccessToken, createRefreshToken } from '../utils/auth';

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

  @Mutation(() => LoginResponse, { nullable: true })
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { entityManager, response }: MyContext
  ):Promise<LoginResponse> {
    const user = await entityManager.findOne(User, { username, deletedAt: null, });
    if (!user) throw Error("Invalid credentials");
    if (!await argon.verify(user.password, password)) throw Error("Invalid credentials");
    response.cookie(
      COOKIE_NAME,
      createRefreshToken(user),
      {
        httpOnly: true,
      }
    );
    return {
      token: createAccessToken(user),
    }
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

@ObjectType()
class LoginResponse {
  @Field()
  token: string; 
}