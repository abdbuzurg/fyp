import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql'
import UserResolver from './resolvers/UserResolver';
import mikroOrmConfig from './mikro-orm.config';
import { MikroORM } from '@mikro-orm/core'
import { AbstractSqlConnection } from '@mikro-orm/mysql';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { COOKIE_NAME } from './constants';
import FeedResolver from './resolvers/FeedResolvers';
import DriverFeedResolver from './resolvers/DriverFeedResolver';
import RequestResolver from './resolvers/RequestResolver';


(async() => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  
  const entityManager = orm.em;
  const knex = (orm.em.getConnection() as AbstractSqlConnection).getKnex();
  
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ 
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: false,
        sameSite: 'lax',
      },
      saveUninitialized: false,
      secret: 'super-secret-key',
      resave: false,  
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, FeedResolver, DriverFeedResolver, RequestResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ 
      entityManager, 
      knex,
      request: req,
      response: res
    }),
  });

  apolloServer.applyMiddleware({ app });
  
  app.listen(4000, () => console.log("Application starting at the port 4000 http://localhost:4000/graphql"));
})();