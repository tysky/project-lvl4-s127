import 'babel-polyfill';

import path from 'path';
import Koa from 'koa';
import Pug from 'koa-pug';
import bodyParser from 'koa-bodyparser';
import middleware from 'koa-webpack';
import serve from 'koa-static';
import Router from 'koa-router';
import koaLogger from 'koa-logger';
import session from 'koa-generic-session';
import flash from 'koa-flash-simple';
import methodOverride from 'koa-methodoverride';
import Rollbar from 'rollbar';
import _ from 'lodash';

import addRoutes from './routes';
import container from './lib/container';
import getWebpackConfig from '../webpack.config.babel';
import models from './models';

export default () => {
  const app = new Koa();
  const rollbar = new Rollbar(process.env.ROLLBAR_TOKEN);

  app.keys = ['some secret hurr'];

  app.use(async (ctx, next) => {
    try {
      await next();
      const status = ctx.status || 404;
      if (status === 404) {
        ctx.throw(404);
      }
    } catch (err) {
      ctx.status = err.status || 500;
      if (ctx.status === 404) {
        await ctx.render('404');
      } else {
        rollbar.error(err, ctx.request);
      }
    }
  });
  app.use(session(app));
  app.use(flash());

  app.use(async (ctx, next) => {
    ctx.state = {
      flash: ctx.flash,
      isSignedIn: () => ctx.session.userId !== undefined,
      userId: () => ctx.session.userId,
      fullName: () => ctx.session.fullName,
    };
    await next();
  });

  app.use(bodyParser());
  app.use(methodOverride((req) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    return req.body._method; // eslint-disable-line
    }
    return null;
  }));
  app.use(serve(path.join(__dirname, '..', 'public')));
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

  const pug = new Pug({
    viewPath: path.join(__dirname, 'views'),
    debug: true,
    pretty: true,
    compileDebug: true,
    locals: [],
    basedir: path.join(__dirname, 'views'),
    helperPath: [
      { _ },
      { urlFor: (...args) => router.url(...args) },
    ],
  });
  pug.use(app);
  const syncDB = async () => {
    await models.sequelize.sync();
  };
  syncDB();
  return app;
};
