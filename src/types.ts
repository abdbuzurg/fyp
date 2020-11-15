import { Connection, EntityManager, IDatabaseDriver} from "@mikro-orm/core";
import { Knex } from "@mikro-orm/mysql";

export type MyContext = {
  entityManager: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  knex: Knex<any, unknown[]>
}