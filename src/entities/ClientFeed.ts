import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";
import RequestTable from "./RequestTable";
import User from "./User";

@ObjectType()
@Entity({ tableName: "client_feed" })
export default class ClientFeed {
  @Field()
  @PrimaryKey()
  id!: number;

  @ManyToOne("User")
  driver: User;

  @Field()
  @Property({ name: "initial_location" })
  initialLocation: string;
  
  @Field()
  @Property({ name: "final_location"})
  finalLocation: string;

  @Field()
  @Property()
  pricing: String;

  @Field()
  @Property({ name: "car_model" })
  carModel: string;

  @Field()
  @Property({ name: "number_of_seats" })
  numberOfSeats: String
  
  @Field()
  @Property({ name: "departure_date" })
  departureDate: string;

  @Field()
  @Property()
  description: String

  @ManyToMany(() => RequestTable, "clientFeedRequest", { owner: true, nullable: true })
  request = new Collection<RequestTable>(this);

  @Property({type: "date", name: "created_at"})
  createdAt = new Date();

  @Property({type: "date", name: "update_at", onUpdate: () => new Date()})
  updatedAt = new Date();

  @Property({type: "date", name: "deleted_at", nullable: true})
  deletedAt: Date;
}