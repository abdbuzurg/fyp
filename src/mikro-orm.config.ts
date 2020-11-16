import { MikroORM } from '@mikro-orm/core'
import path from "path";
import User from './entities/User'; 
import { DB_NAME, DB_PASSWORD, DB_USERNAME, __production__ } from './constants';

export default {
  entities: [User],
  migrations: {
    path: path.join(__dirname, './migrations'), 
    pattern: /^[\w-]+\d+\.[tj]s$/, 
  },
  dbName: DB_NAME,
  type: "mysql",
  password: DB_PASSWORD,
  user: DB_USERNAME,
  debug: __production__,
} as Parameters<typeof MikroORM.init>[0];