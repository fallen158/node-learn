/**
 * ps: 每个漫画页面章节不同
 * 以下测试爬取快看漫画网站，2500个漫画爬取,几w加页面，最终只能爬取第一章节的内容，未完待续
 */
const puppeteer = require('puppeteer')
const chalk = require('chalk')
const fs = require('fs')
const log = console.log
const TOTAL_PAGE = 50 // 定义爬取的网页数量
;(async () => {
  const browser = await puppeteer.launch({ headless: false, devtools: true })
  log(chalk.green('服务正常启动'))
  const page = (await browser.pages())[0]
  page.on('console', msg => {
    if (typeof msg === 'object') {
      // console.dir(msg)
    } else {
      log(chalk.blue(msg))
    }
  })
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('https://www.kuaikanmanhua.com/tag/0?state=1&page=1')
  log(chalk.yellow('页面初次加载完毕'))
  for (let i = 0; i < TOTAL_PAGE; i++) {
    // 等待按钮出现
    await page.waitForSelector('.pagination>li')
    // 找到分页跳转按钮
    const pageSubmit = await page.$$('.pagination>li')
    // 模拟点击跳转
    await pageSubmit[pageSubmit.length - 1].click()
    // 等待页面加载完毕，这里设置的是固定的时间间隔，但是因为等待的时间过久导致报错（Puppeteer默认的请求超时是30s,可以修改）,因为这个页面总有一些不需要的资源要加载，会导致超时，因此我设定等待3s就够了
    await page.waitFor(3000)
    // 清除当前的控制台信息
    console.clear()
    log(chalk.yellow('页面数据加载完毕'))
    // 处理封面数据，这个函数的实现在下面
    await handlePageData()

    await page.waitFor(5000)
    // 处理点击跳转漫画页面,处理漫画数据
    await handleLinkComius()

    // 一个页面爬取完毕以后稍微歇歇，不然太快会把你当成机器人弹出验证码（虽然我们本来就是机器人）
    await page.waitFor(3000)
  }

  async function handlePageData () {
    let result = await page.evaluate(() => {
      let items = document.querySelectorAll('.ItemSpecial')
      let movies = []
      if (items && items.length >= 1) {
        items.forEach(async item => {
          let link = item.querySelector('.itemLink')
          let url = item.querySelector('a>span>.img').src
          let title = item.querySelector('a>.itemTitle').innerHTML
          let author = item.querySelector('p>.author').innerHTML
          movies.push({
            url,
            title,
            author
          })
          // 点击每个图片的跳转按钮
          await link.click()
        })
      }
      return movies
    })

    // fs.appendFileSync('comius.json', JSON.stringify(result), err => {
    //   if (err) log.err(err)
    //   log(chalk.green('数据添加完毕'))
    // })
    var logStream = fs.createWriteStream('comius.json', { flags: 'a' })
    logStream.write(JSON.stringify(result), () => {
      log(chalk.red('数据添加完毕'))
    })
  }

  async function handleLinkComius () {
    await page.waitForSelector('.ItemSpecial > a')
    await page.waitFor(1000)
    const comicSubmit = await page.$$('.ItemSpecial > a')
    if (comicSubmit && comicSubmit.length > 1) {
      comicSubmit.map(async (item, index) => {
        await handlClickButton(index)
        // 等待跳转页面渲染完成
        await page.waitFor(30000)
        // 处理漫画数据

        await hanldeComiusData(index)
      })
    }
  }

  async function handlClickButton (index) {
    const pageIndex = (await browser.pages())[index]
    await pageIndex.evaluate(async () => {
      // 观看漫画按钮
      let combicClick = document.querySelector('.btnListLeft > .firstBtn')
      if (combicClick) {
        combicClick.click()
      }
    })
  }

  async function hanldeComiusData (index) {
    const pageIndex = (await browser.pages())[index]
    const result = await pageIndex.evaluate(async () => {
      console.log('测试是否允许成功--------------------------------------')

      // // 获取当前漫画总章节,标题也在 list 里面,所有减一
      // const allChapter =
      //   document.querySelectorAll('.listBox>.list>li').length - 1
      // console.log('当前漫画总章数', allChapter)
      // // 找到下一话点击按钮
      // const comiusSubmit = document.querySelectorAll(
      //   '.AdjacentChapters>.cls>li>a'
      // )[3]
      // for (let i = 0; i < allChapter; i++) {
      //   comiusSubmit.click()
      // }
      // 处理懒加载
      function autoScroll () {
        return new Promise((resolve, reject) => {
          try {
            var totalHeight = 0
            var distance = 500
            var timer = setInterval(() => {
              window.scrollBy(0, distance)
              totalHeight += distance
              if (totalHeight >= document.body.scrollHeight) {
                clearInterval(timer)
                resolve(true)
              }
            })
          } catch (error) {
            reject(error)
          }
        }, 50)
      }

      let result = await autoScroll()
      if (result) {
        const title = document.querySelectorAll('.listBox>.list>li>a')[0]
          .innerText
        let obj = []
        // 找到当前章节漫画图片
        let allImgLists = document.querySelectorAll('.imgList>img')
        if (allImgLists && allImgLists.length > 1) {
          console.log(allImgLists)
          allImgLists.forEach(item => {
            obj.push({
              img_url: item.getAttribute('data-src'),
              title
            })
          })
        }
        console.log(obj)
        return obj
      }
    })

    var logStream = fs.createWriteStream('comiusData.json', { flags: 'a' })
    logStream.write(JSON.stringify(result), () => {
      log(chalk.red('数据添加完毕'))
    })

    // await pageIndex.waitForSelector('.listBox>.list>li')
    // await pageIndex.waitFor(1000)
    // const allChapter = (await pageIndex.$$('.listBox>.list>li').length) - 1
    // console.log('当前漫画总章数', allChapter)
    await pageIndex.close()
  }
})()