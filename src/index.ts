import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql'
import UserResolver from './resolvers/UserResolver';
import mikroOrmConfig from './mikro-orm.config';
import { MikroORM } from '@mikro-orm/core'
import { AbstractSqlConnection } from '@mikro-orm/mysql';
import FeedResolver from './resolvers/FeedResolvers';
import DriverFeedResolver from './resolvers/DriverFeedResolver';
import RequestResolver from './resolvers/RequestResolver';
import { userLoader } from './utils/userLoader';
import cors from "cors";
import ClientFeedResolver from './resolvers/ClientFeedResolver';
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import { COOKIE_NAME, REFRESH_TOKEN } from './constants';
import User from './entities/User';
import { createAccessToken, createRefreshToken } from './utils/auth';

(async() => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  
  const entityManager = orm.em;
  const knex = (orm.em.getConnection() as AbstractSqlConnection).getKnex();
  
  const app = express();

  app.use(cookieParser());
  app.post("/refresh_token", async(req, res) => {
    const token = req.cookies!.jid;
    if (!token) {
      return res.send({ok: false, token: ''});
    }

    let payload = null;
    try {
      payload = verify(token, REFRESH_TOKEN!) as any;
    } catch (error) {
      console.log(error);
      return res.send({ok: false, token: ''});
    }

    const user = await entityManager.findOne(User, payload.userId);
    if (!user) return res.send({ok: false, token: ''});
    
    res.cookie(
      COOKIE_NAME,
      createRefreshToken(user),
      {
        httpOnly: true,
      }
    );

    return res.send({ok: true, token: createAccessToken(user)});
  });
  
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, FeedResolver, DriverFeedResolver, ClientFeedResolver, RequestResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ 
      entityManager, 
      knex,
      request: req,
      response: res,
      userLoader: userLoader({ entityManager })
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  
  app.listen(4000, () => console.log("Application starting at the port 4000 http://localhost:4000/graphql"));
})();