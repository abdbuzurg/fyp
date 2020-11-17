import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import ClientFeed from "./ClientFeed";
import DriverFeed from "./DriverFeed";
import User from "./User";

@Entity({ tableName: "request" })
export default class RequestTable{
  
  @PrimaryKey()
  id!: number;

  @ManyToOne("User")
  sender: User

  @ManyToOne("User")
  reciever: User;

  @Property({ name: "feed_type" })
  feedType: WhoToWhom;
  
  @Property({ name: "request_status" })
  requestStatus: Status;
  
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

enum WhoToWhom {
  CLIENT_TO_DRIVER,
  DRIVER_TO_CLIENT
}

enum Status {
  DECLINED,
  PENDING,
  ACCEPTED
}