import { Entity, ManyToOne, PrimaryKey, Property, } from "@mikro-orm/core";
import { Field, Int, ObjectType} from "type-graphql";
import User from "./User";

@ObjectType()
@Entity()
export default class DriverFeed {

  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @ManyToOne()
  client: User;

  @Field(() => String)
  @Property()
  destination: string;

  @Field(() => Int)
  @Property()
  pricing: number;

  @Field(() => String)
  @Property({ name: "departure_date"})
  departureDate: string;

  @Property({type: "date", name: "created_at"})
  createdAt = new Date();

  @Property({type: "date", name: "update_at", onUpdate: () => new Date()})
  updatedAt = new Date();

  @Property({type: "date", name: "deleted_at", nullable: true})
  deletedAt: Date;
}