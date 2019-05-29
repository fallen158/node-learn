const puppeteer = require('puppeteer')
const chalk = require('chalk')

const log = console.log
const TOTAL_PAGE = 10 // 定义爬取的网页数量

// 格式化进度输出, 用来显示当前爬取的进度
function formatProgress (current) {
  let percent = (current / TOTAL_PAGE) * 100
  let done = ~~(current / TOTAL_PAGE * 40)
  let left = 40 - done
  let str = `当前进度：[${''.padStart(done, '=')}${''.padStart(left, '-')}]   ${percent}%`
  return str
}

; (async () => {
  const browser = await puppeteer.launch({ headless: false })
  log(chalk.green('服务正常启动'))
  try {
    const page = (await browser.pages())[0]
    page.on('console', msg => {
      if (typeof msg === 'object') {
        console.dir(msg)
      } else {
        log(chalk.blue(msg))
      }
    })
    // await page.setViewport({ width: 800, height: 800 })
    await page.goto('https://movie.douban.com/top250?start=0&filter=')
    log(chalk.yellow('页面初次加载完毕'))
    for (let i = 0; i < TOTAL_PAGE; i++) {
      // 找到分页跳转按钮
      const pageSubmit = await page.$('.paginator > a')
      console.log(pageSubmit)
      // 模拟点击跳转
      await pageSubmit.click()
      // 等待页面加载完毕，这里设置的是固定的时间间隔，之前使用过page.waitForNavigation()，但是因为等待的时间过久导致报错（Puppeteer默认的请求超时是30s,可以修改）,因为这个页面总有一些不需要的资源要加载，而我的网络最近日了狗，会导致超时，因此我设定等待2.5s就够了
      await page.waitFor(2500)
      // 清除当前的控制台信息
      console.clear()
      log(chalk.yellow(formatProgress(i)))
      log(chalk.yellow('页面数据加载完毕'))

      // 处理数据，这个函数的实现在下面
      await handleData()
      // 一个页面爬取完毕以后稍微歇歇，不然太快豆瓣会把你当成机器人弹出验证码（虽然我们本来就是机器人）
      await page.waitFor(2500)
    }
    async function handleData(){
      let result = await page.evaluate(() => {
        let $ = window.$
        let items = $('.item')
        let movies = []
        if (items && items.length > 1) {
          items.each((index, item) => {
            let it = $(item)
            let link = it.find('a').attr('href')
            let title = it.find('.title').text()
            let id = it.find('em').text()
            let pic = it.find('.rating_num').text()
            movies.push({
              link, title, pic: Number(pic), id: Number(id)
            })
          })
        }
        return movies
      })
      return result
    }
  } catch (error) {
    console.log(log(chalk.red(error)))
  }
})()
