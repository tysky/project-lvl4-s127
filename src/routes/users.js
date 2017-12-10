import buildFormObj from '../lib/formObjectBuilder';
import { User } from '../models';
import log from '../lib/logger';

export default (router) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users', { users });
    })
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .post('users', '/users', async (ctx) => {
      const { form } = ctx.request.body;
      log(form);
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.set('User has been created');
        ctx.redirect('/');
      } catch (e) {
        ctx.response.status = 422;
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    })
    .get('userInfo', '/users/:id', async (ctx) => {
      const user = await User.findById(ctx.params.id);

      try {
        ctx.render('users/info', { user });
      } catch (e) {
        ctx.state.errorMessage = "Given user doesn't exist!";
        ctx.render('users/', { f: buildFormObj(user, e) });
      }
    })
    .get('userEdit', '/users/:id/edit', async (ctx) => {
      if (Number(ctx.params.id) !== ctx.session.userId) {
        ctx.state.errorMessage = "You can't edit another user!";
        ctx.redirect(router.url('root'));
        return;
      }
      const user = await User.findById(Number(ctx.params.id));
      ctx.render('users/edit', { f: buildFormObj(user) });
    })
    .patch('userUpdate', '/users/:id', async (ctx) => {
      const id = Number(ctx.params.id);
      if (id !== ctx.session.userId) {
        ctx.state.errorMessage = "You can't edit another user!";
        ctx.redirect(router.url('root'));
        return;
      }
      const { form } = ctx.request.body;
      log(form);
      const user = await User.findById(id);
      try {
        await user.update({ ...form });
        ctx.session.fullName = user.fullName;
        ctx.flash.set('User has been updated');
        ctx.redirect(`/users/${id}`);
      } catch (e) {
        ctx.response.status = 422;
        ctx.state.errorMessage = 'Error with updating user info!';
        ctx.render('users/edit', { f: buildFormObj(user, e) });
      }
    });
};
