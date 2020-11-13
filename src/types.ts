import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";

export type MyContext{
  entity: MikroORM<IDatabaseDriver<Connection>>
}