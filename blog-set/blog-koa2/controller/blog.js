const { exec } = require('../db/mysq');
const getList = async (author, keyword) => {
  // 1=1 是为啦以防 author，keyword 为空的情况下
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}'`;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%'`;
  }
  sql += `order by createtime desc;`;
  // 返回 Promise
  return await exec(sql);
};

const getDetail = async id => {
  const sql = `select * from blogs where id=${id}`;
  const rows = await exec(sql);
  return rows[0];
};

const newBlog = async (blogData = {}) => {
  // blogDta 是一个对象 包含  title content author createtime等属性
  const { title, content, author } = blogData;
  const createtime = Date.now();
  const sql = `insert into blogs(title,content,createtime,author) values('${title}','${content}','${createtime}','${author}');`;
  const insertData = await exec(sql);
  return {
    id: insertData.insertId
  };
};

const updataBlog = async (id, blogData = {}) => {
  // id 就是要更新 blog 的 id
  // blogDta 是一个对象 包含  title content 等属性
  const { title, content } = blogData;
  const sql = `update blogs set title='${title}',content='${content}' where id=${id}`;
  const updateData = await exec(sql);
  if (updateData.affectedRows > 0) {
    return true;
  }
  return false;
};

const delBlog = async (id, author) => {
  // 删除的 blog 的 id
  const sql = `delete from blogs where id='${id}' and author='${author}';`;
  const delData = await exec(sql);
  if (delData.affectedRows > 0) {
    return true;
  }
  return false;
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updataBlog,
  delBlog
};
