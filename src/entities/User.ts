import { Entity, PrimaryKey, Property, } from "@mikro-orm/core";


@Entity()
export class User {

  constructor(email: String, username: String, password: String, name: String, mobileNumber: String){
    this.email = email;
    this.username = username;
    this.password = password;
    this.name = name;
    this.mobileNumber = mobileNumber;
  }

  @PrimaryKey()
  id!: number;

  @Property()
  email!: String;

  @Property()
  username!:String;

  @Property()
  password!: String;

  @Property()
  name!: String;

  @Property({name: "mobile_number"})
  mobileNumber!: String;

  @Property({name: "super_user"})
  superUser: Boolean = false;

  @Property({type: "date", name: "created_at"})
  createdAt = new Date();

  @Property({type: "date", name: "update_at", onUpdate: () => new Date()})
  updatedAt = new Date();

  @Property({type: "date", name: "deleted_at", nullable: true})
  deletedAt: Date;
}