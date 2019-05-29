const superagent = require('superagent')
const cheerio = require('cheerio')
const Koa = require('koa')
const app = new Koa()
const util = require('util')

/**
 * index.js
 * [description] - 使用superagent.get()方法来访问百度新闻首页
 */

let getHotNews = res => {
  let hotNews = []
  // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res.text中。

  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio.load(res.text)
  $('div#pane-news ul li a').each((idx, ele) => {
    // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
    // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
    let news = {
      title: $(ele).text(), // 获取新闻标题
      href: $(ele).attr('href') // 获取新闻网页链接
    }
    hotNews.push(news)
  })
  return hotNews
}

app.use(async ctx => {
  let data = await util.promisify(superagent).get('http://news.baidu.com/')
  if (data) {
    return (ctx.body = getHotNews(data))
  }
  return (ctx.body = '新闻请求失败')
})
app.listen(4000, () => {
  console.log('node app port at http://localhost:4000')
})
