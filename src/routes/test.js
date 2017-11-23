export default (router) => {
  router.get('root', '/test', (ctx) => {
    ctx.body = 'TEST!!';
  });
};
