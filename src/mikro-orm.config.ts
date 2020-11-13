import { MikroORM } from '@mikro-orm/core'
import path from "path";
import User from './entities/User'; 

export default {
  entities: [User],
  migrations: {
    path: path.join(__dirname, './migrations'), 
    pattern: /^[\w-]+\d+\.[tj]s$/, 
  },
  dbName: "final-year-project",
  type: "mysql",
  password: "password",
  user: "root",
  debug: !process.env.production,
} as Parameters<typeof MikroORM.init>[0];