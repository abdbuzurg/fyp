import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";
import RequestTable from "./RequestTable";
import User from "./User";

@ObjectType()
@Entity({ tableName: "client_feed" })
export default class ClientFeed {
  @PrimaryKey()
  id!: number;

  @ManyToOne("User")
  driver: User;

  @Field()
  @Property()
  destination: string;

  @Field()
  @Property()
  pricing: number;

  @Field()
  @Property({ name: "car_model" })
  carModel: string;

  @Field()
  @Property({ name: "number_of_seats" })
  numberOfSeats: number;
  
  @Field()
  @Property({ name: "arrival_time" })
  arrivalTime: string;

  @Field()
  @Property({ name: "departure_date" })
  departureDate: string;

  @ManyToMany(() => RequestTable, "clientFeedRequest", { owner: true, nullable: true })
  request = new Collection<RequestTable>(this);

  @Property({type: "date", name: "created_at"})
  createdAt = new Date();

  @Property({type: "date", name: "update_at", onUpdate: () => new Date()})
  updatedAt = new Date();

  @Property({type: "date", name: "deleted_at", nullable: true})
  deletedAt: Date;
}