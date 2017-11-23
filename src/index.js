import Koa from 'koa';
import Rollbar from 'rollbar';
// import dotenv from 'dotenv';
import bodyParser from 'koa-bodyparser';
import middleware from 'koa-webpack';
import Router from 'koa-router';
import koaLogger from 'koa-logger';

import addRoutes from './routes';
import container from '../container';
import getWebpackConfig from '../webpack.config.babel';

export default () => {
  // dotenv.config();

  const app = new Koa();

  const rollbar = new Rollbar(process.env.ROLLBAR_TOKEN);
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      rollbar.error(err, ctx.request);
    }
  });

  app.use(bodyParser());
  rollbar.log('msg!');
  if (process.env.NODE_ENV !== 'test') {
    app.use(middleware({
      config: getWebpackConfig(),
    }));
  }

  app.use(koaLogger());
  const router = new Router();
  addRoutes(router, container);
  app.use(router.allowedMethods());
  app.use(router.routes());

  app.use((ctx) => {
    ctx.body = 'Hello User!';
  });

  return app;
};
