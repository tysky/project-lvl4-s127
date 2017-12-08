import buildFormObj from '../lib/formObjectBuilder';
import { encrypt } from '../lib/secure';
import { User } from '../models';

export default (router) => {
  router
    .get('newSession', '/session/new', async (ctx) => {
      const data = {};
      ctx.render('sessions/new', { f: buildFormObj(data) });
    })
    .post('session', '/session', async (ctx) => {
      const { email, password } = ctx.request.body.form;
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (user && user.passwordDigest === encrypt(password)) {
        ctx.session.userId = user.id;
        ctx.flash.set(`Welcome ${user.firstName}`);
        ctx.redirect(router.url('root'));
        return;
      }
      const data = {};
      ctx.state.errorMessage = 'Email or password were wrong. Try again';
      ctx.render('sessions/new', { f: buildFormObj(data) });
      ctx.response.status = 422;
    })
    .delete('session', '/session', async (ctx) => {
      ctx.session = {};
      ctx.flash.set('Goodbye');
      ctx.redirect(router.url('root'));
    });
};
