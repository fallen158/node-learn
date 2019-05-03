const router = require('koa-router');
const Router = new router({ prefix: '/api/user' });
const { SussessModel, ErrorModel } = require('../model/resModel');
const { login } = require('../controller/user');

Router.post('/login', async ctx => {
  const { username, password } = ctx.request.body;
  const data = await login(username, password);
  if (data.username) {
    ctx.session.username = data.username;
    ctx.session.realname = data.realname;
    ctx.body = new SussessModel('登录成功');
    return;
  }
  ctx.body = new ErrorModel('登录失败');
});

// Router.get('/session-test', async ctx => {
//   if (ctx.session.viewNum === null) {
//     ctx.session.viewNum = 0;
//   }
//   ctx.session.viewNum++;
//   ctx.body = {
//     code: 0,
//     viewNum: ctx.session.viewNum
//   };
// });

module.exports = Router;
