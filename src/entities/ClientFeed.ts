import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import RequestTable from "./RequestTable";
import User from "./User";

@Entity({ tableName: "client_feed" })
export default class ClientFeed {
  @PrimaryKey()
  id!: number;

  @ManyToOne("User")
  driver: User;

  @Property()
  destination: string;

  @Property()
  pricing: number;

  @Property({ name: "car_model" })
  carModel: string;

  @Property({ name: "number_of_seats" })
  numberOfSeats: number;
  
  @Property({ name: "arrival_time" })
  arrivalTime: string;

  @Property({ name: "departure_date" })
  departureDate: string;

  @ManyToMany(() => RequestTable, "clientFeedRequest", { owner: true })
  request = new Collection<RequestTable>(this);

  @Property({type: "date", name: "created_at"})
  createdAt = new Date();

  @Property({type: "date", name: "update_at", onUpdate: () => new Date()})
  updatedAt = new Date();

  @Property({type: "date", name: "deleted_at", nullable: true})
  deletedAt: Date;
}