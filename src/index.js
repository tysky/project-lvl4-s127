import Koa from 'koa';
import Rollbar from 'rollbar';
import dotenv from 'dotenv';
// import container from '../container';

dotenv.config();

const rollbar = new Rollbar('d759670a75a24636a561ebef1945a712');
const app = new Koa();

rollbar.log('Hello new world!');

app.use((ctx) => {
  ctx.body = 'Hello User!';
});

export default app;
