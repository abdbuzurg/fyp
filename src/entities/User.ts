import { Entity, PrimaryKey, Property, } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export default class User {

  constructor(email: string, username: string, password: string, name: string, mobileNumber: string){
    this.email = email;
    this.username = username;
    this.password = password;
    this.name = name;
    this.mobileNumber = mobileNumber;
  }

  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property()
  email!: string;

  @Field(() => String)
  @Property()
  username!:string;

  @Field(() => String)
  @Property()
  password!: string;

  @Field(() => String)
  @Property()
  name!: string;

  @Field(() => String)
  @Property({name: "mobile_number"})
  mobileNumber!: string;

  @Field(() => Boolean)
  @Property({name: "super_user"})
  superUser: Boolean = false;

  @Property({type: "date", name: "created_at"})
  createdAt = new Date();

  @Property({type: "date", name: "update_at", onUpdate: () => new Date()})
  updatedAt = new Date();

  @Property({type: "date", name: "deleted_at", nullable: true})
  deletedAt: Date;
}