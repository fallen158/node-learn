const router = require('koa-router');
const Router = new router({ prefix: '/api/blog' });
const {
  getList,
  getDetail,
  newBlog,
  updataBlog,
  delBlog
} = require('../controller/blog');
const { SussessModel, ErrorModel } = require('../model/resModel');
const loginCheck = require('../middleware/loginCheck');

Router.get('/list', async ctx => {
  let author = ctx.query.author || '';
  let keyword = ctx.query.keyword || '';
  if (ctx.query.isadmin) {
    // 管理员界面
    if (ctx.session.username === null) {
      // 未登录
      ctx.body = new SussessModel(listData);
      return;
    }
    // 强制查询自己的博客
    author = ctx.session.username;
  }
  const listData = await getList(author, keyword);
  ctx.body = new SussessModel(listData);
});

Router.get('/detail', async ctx => {
  const detailData = await getDetail(ctx.query.id);
  ctx.body = new SussessModel(detailData);
});

Router.post('/new', loginCheck, async ctx => {
  ctx.request.body.author = ctx.session.username;
  const data = await newBlog(ctx.request.body);
  ctx.body = new SussessModel(data);
});

Router.post('/update', loginCheck, async ctx => {
  const val = await updataBlog(ctx.query.id, ctx.request.body);
  if (val) {
    return (ctx.body = new SussessModel());
  }
  ctx.body = new ErrorModel('更新博客失败');
});

Router.post('/del', loginCheck, async ctx => {
  const author = ctx.session.username;
  const val = await delBlog(ctx.query.id, author);
  if (val) {
    return (ctx.body = new SussessModel());
  }
  ctx.body = new ErrorModel('删除博客失败');
});

module.exports = Router;
