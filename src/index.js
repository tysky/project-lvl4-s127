import Koa from 'koa';

const app = new Koa();

app.use((ctx) => {
  ctx.body = 'Hello User!!!';
});

export default app;
