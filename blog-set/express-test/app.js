const express = require('express');
const app = express();

// express 中间件原理学习
app.use((req, res, next) => {
  console.log('请求开始....', req.method, req.url);
  next();
});

app.use((req, res, next) => {
  // 处理 cookie
  req.cookie = {
    userId: 'abc123'
  };
  next();
});

app.use((req, res, next) => {
  // 处理 post Data
  // 异步
  setTimeout(() => {
    req.body = {
      a: 100,
      b: 200
    };
    next();
  });
});

app.use('/api', (req, res, next) => {
  // 处理 api 路由
  console.log('处理 /api 路由');
  next();
});

app.get('/api', (req, res, next) => {
  console.log('get /api 路由');
  next();
});

app.post('/api', (req, res, next) => {
  console.log('post /api 路由');
  next();
});

// 模拟登录验证
function loginCheck(req,res,next){
    setTimeout(()=>{
        res.json({
            code: 1,
            msg: '登录失败'
        })
        // console.log('模拟登录成功')
        // next()
    })
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
  console.log('get /api/get-cookie');
  res.json({
    code: 0,
    data: req.cookie
  });
});

app.post('/api/get-cookie', (req, res, next) => {
  console.log('post /api/get-cookie');
  res.json({
    code: 0,
    data: req.body
  });
});

app.use((req, res, next) => {
  console.log('处理 404');
  res.json({
    code: 1,
    msg: '404 Not Fount'
  });
});

app.listen(3000, () => {
  console.log('server is  running on port 3000');
});
