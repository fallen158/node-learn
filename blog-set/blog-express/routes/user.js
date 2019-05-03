var express = require('express');
var router = express.Router();
const { SussessModel, ErrorModel } = require('../model/resModel');
const { login } = require('../controller/user');

/* GET home page. */
router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  const result = login(username, password);
  return result.then(data => {
    if (data.username) {
      // 设置 session
      req.session.username = data.username;
      req.session.realname = data.realname;
      res.json(new SussessModel('登录成功'));
      return;
    }
    res.json(new ErrorModel('登录失败'));
  });
});

// router.get('/login-test', (req, res, next) => {
//   if (req.session.username) {
//     res.json({
//       code: 0,
//       msg: `登录成功，用户名为${req.session.username}`
//     });
//   }
//   return res.json({
//     code: 1,
//     msg: '测试失败'
//   });
// });
// router.get('/session-test', (req, res, next) => {
//   const session = req.session;
//   console.log(session);
//   if (session.viewNum === null) {
//     session.viewNum = 0;
//   }
//   session.viewNum++;
//   res.json({
//     viewNum: session.viewNum
//   });
// });
module.exports = router;
