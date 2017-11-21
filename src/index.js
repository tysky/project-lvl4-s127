import Koa from 'koa';
import Rollbar from 'rollbar';
import dotenv from 'dotenv';
// import container from '../container';

dotenv.config();

const app = new Koa();
const rollbar = new Rollbar(process.env.ROLLBAR_TOKEN);

// rollbar.log('Hello world!');

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    rollbar.error(err, ctx.request);
  }
});

app.use((ctx) => {
  ctx.body = 'Hello User!';
});

export default app;
