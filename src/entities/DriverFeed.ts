import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Float, Int, ObjectType } from "type-graphql";
import RequestTable from "./RequestTable";
import User from "./User";

@ObjectType()
@Entity({ tableName: "driver_feed" })
export default class DriverFeed {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ name: "initial_location"})
  initialLocation: string;
  
  @Field(() => String)
  @Property({ name: "final_location"})
  finalLocation: string;

  @Field(() => Float)
  @Property()
  pricing: number;

  @Field(() => String)
  @Property({ name: "departure_date"})
  departureDate: string;
  
  @Field(() => String)
  @Property()
  description: string;

  @ManyToOne("User")
  client: User;

  @ManyToMany(() => RequestTable, "driverFeedRequest", { owner: true, nullable: true })
  request = new Collection<RequestTable>(this);

  @Property({type: "date", name: "created_at"})
  createdAt = new Date();

  @Property({type: "date", name: "update_at", onUpdate: () => new Date()})
  updatedAt = new Date();
 
  @Property({type: "date", name: "deleted_at", nullable: true})
  deletedAt: Date;
}