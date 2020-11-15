import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql'
import UserResolver from './resolvers/UserResolver';
import mikroOrmConfig from './mikro-orm.config';
import { MikroORM } from '@mikro-orm/core'
import { AbstractSqlConnection } from '@mikro-orm/mysql';

(async() => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  const entityManager = orm.em;
  const knex = (orm.em.getConnection() as AbstractSqlConnection).getKnex();
  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    context: () => ({ entityManager, knex }),
  });

  apolloServer.applyMiddleware({ app });
  
  app.listen(4000, () => console.log("Application starting at the port 4000 http://localhost:4000/graphql"));
})();