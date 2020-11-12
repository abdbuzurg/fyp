import { MikroORM } from '@mikro-orm/core';

( async() => {
  const orm = await MikroORM.init({
    entities: [],
    dbName: "final-year-project",
    type: "mysql",
    debug: true,
  });
});