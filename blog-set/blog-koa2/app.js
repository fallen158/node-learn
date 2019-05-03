const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
// 处理 session redis
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const { REDIS_CONF } = require('./conf/db');

// 处理日志
const fs = require('fs');
const path = require('path')
const morgan = require('koa-morgan');

const index = require('./routes/index');
const users = require('./routes/users');
const user = require('./routes/user');
const blog = require('./routes/blog');

// error handler
onerror(app);

// 日志记录
const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
  // 开发测试环境
  app.use(morgan('dev'));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  });
  app.use(
    morgan('combined', {
      stream: writeStream
    })
  );
}

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// session 配置
app.keys = ['wjdsni@_$#21FX.82;'];
app.use(
  session({
    // 配置 cookie
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    },
    // 配置 redis
    store: redisStore({
      all: `${REDIS_CONF.host}:${REDIS_CONF.port }` 
    })
  })
);

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(user.routes(), index.allowedMethods());
app.use(blog.routes(), users.allowedMethods());
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
