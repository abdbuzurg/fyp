import { Connection, EntityManager, IDatabaseDriver} from "@mikro-orm/core";
import { Knex } from "@mikro-orm/mysql";
import { Request, Response } from 'express';
import { userLoader } from "./utils/UserLoader";

export type MyContext = {
  entityManager: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  knex: Knex<any, unknown[]>;
  request: Request & { session: { userId: number}};
  response: Response;
  userLoader: ReturnType<typeof userLoader>
}

export type MyLoader = {
  entityManager: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
}