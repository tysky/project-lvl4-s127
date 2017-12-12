import buildFormObj from './formObjectBuilder';

export default async (ctx, next) => {
  if (!ctx.state.isSignedIn()) {
    ctx.response.status = 403;
    ctx.state.errorMessage = 'You must to be authorised to see this page';
    ctx.render('sessions/new', { f: buildFormObj({}) });
    return;
  }
  await next();
};
