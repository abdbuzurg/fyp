import { MikroORM } from '@mikro-orm/core';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/HelloResolver';

(async() => {
  const orm = await MikroORM.init(mikroConfig);
  //await orm.getMigrator().createMigration();
  //await orm.getMigrator().up();

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
  });

  apolloServer.applyMiddleware({ app });
  
  app.listen(4000, () => console.log("Application starting at the port 4000 http://localhost:4000"));
})();