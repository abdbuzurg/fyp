import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import ClientFeed from "./ClientFeed";
import DriverFeed from "./DriverFeed";
import User from "./User";

@ObjectType()
@Entity({ tableName: "request" })
export default class RequestTable{
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @ManyToOne("User")
  sender: User

  @ManyToOne("User")
  receiver: User;

  @Field(() => Int)
  @Property({ name: "feed_type" })
  feedType: FeedType;

  @Field(() => Int)
  @Property({ name: "request_status" })
  requestStatus: Status;
  
  @Field(() => Int)
  @Property({ name: "response_status" })
  responseStatus: Status;

  @ManyToMany(() => DriverFeed, "request", { mappedBy: "request", owner: false })
  driverFeedRequest = new Collection<DriverFeed>(this);

  @ManyToMany(() => ClientFeed, "request", { mappedBy: "request", owner: false })
  clientFeedRequest = new Collection<ClientFeed>(this);

  @Property({type: "date", name: "created_at"})
  createdAt = new Date();

  @Property({type: "date", name: "update_at", onUpdate: () => new Date()})
  updatedAt = new Date();
 
  @Property({type: "date", name: "deleted_at", nullable: true})
  deletedAt: Date;
}

enum FeedType {
  DriverFeed,
  ClientFeed
}

enum Status {
  DECLINED,
  PENDING,
  ACCEPTED
}