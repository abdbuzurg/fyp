import { Connection, EntityManager, IDatabaseDriver} from "@mikro-orm/core";
import { Knex } from "@mikro-orm/mysql";
import { Request, Response } from 'express';

export type MyContext = {
  entityManager: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  knex: Knex<any, unknown[]>;
  request: Request & { session: { userId: Number}};
  response: Response;
}