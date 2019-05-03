var express = require('express');
var router = express.Router();
const {
  getList,
  getDetail,
  newBlog,
  updataBlog,
  delBlog
} = require('../controller/blog');
const { SussessModel, ErrorModel } = require('../model/resModel');
const loginCheck = require('../middleware/loginCheck');

/* GET home page. */
router.get('/list', function(req, res, next) {
  let author = req.query.author || '';
  let keyword = req.query.keyword || '';

  if (req.query.isadmin) {
    // 管理员界面
    if (req.session.username === null) {
      // 未登录
      res.json(new SussessModel(listData));
      return;
    }
    // 强制查询自己的博客
    author = req.session.username;
  }

  const result = getList(author, keyword);
  return result.then(listData => res.json(new SussessModel(listData)));
});

router.get('/detail', function(req, res, next) {
  const result = getDetail(req.query.id);
  return result.then(detailData => res.json(new SussessModel(detailData)));
});

router.post('/new', loginCheck, function(req, res, next) {
  req.body.author = req.session.username;
  const result = newBlog(req.body);
  return result.then(data => res.json(new SussessModel(data)));
});

router.post('/update', loginCheck, function(req, res, next) {
  const result = updataBlog(req.query.id, req.body);
  console.log(result);
  return result.then(val => {
    if (val) {
      return res.json(new SussessModel());
    }
    return res.json(new ErrorModel('更新博客失败'));
  });
});

router.post('/del', loginCheck, function(req, res, next) {
  const author = req.session.username;
  const result = delBlog(req.query.id, author);
  return result.then(val => {
    if (val) {
      return res.json(new SussessModel());
    }
    return res.json(new ErrorModel('删除博客失败'));
  });
});

module.exports = router;
