import { Entity, PrimaryKey, Property, } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export default class User {

  constructor(email: String, username: String, password: String, name: String, mobileNumber: String){
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
  email!: String;

  @Field(() => String)
  @Property()
  username!:String;

  @Field(() => String)
  @Property()
  password!: String;

  @Field(() => String)
  @Property()
  name!: String;

  @Field(() => String)
  @Property({name: "mobile_number"})
  mobileNumber!: String;

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