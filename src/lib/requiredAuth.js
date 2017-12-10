export default async (ctx, next) => {
  if (!ctx.state.isSignedIn()) {
    ctx.response.status = 403;
    ctx.flash.set('You must to be authorised to see this page');
    ctx.redirect('/session/new');
    return;
  }
  await next();
};
