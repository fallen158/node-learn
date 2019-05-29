/**
 * 结合之前的内容，爬取快看漫画网站，单个漫画全部章节，放入 mysql 数据库
 */
const puppeteer = require('puppeteer')
const chalk = require('chalk')
const fs = require('fs')
const log = console.log
;(async function () {
  const browser = await puppeteer.launch({ headless: false, devtools: true })
  log(chalk.green('服务正常启动'))
  const page = (await browser.pages())[0]
  // 爬取的数据存储
  try {
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

    // 等待漫画出现
    await page.waitForSelector('.tagContent')
    // 找到第一个漫画
    const comiusItem = await page.$('.tagContent > .ItemSpecial > a')
    // 点击新开一个漫画详情窗口
    await comiusItem.click()
    // 等待第二个窗口加载完毕
    await page.waitFor(3000)
    // 处理第二个窗口漫画介绍数据
    await hanldeComiusDesData()
    // 等待第三个窗口加载完毕
    await page.waitFor(3000)

    await handleComiusData()
  } catch (error) {
    console.error(error)
    log(chalk.red('服务意外终止'))
    await page.close()
  }

  async function hanldeComiusDesData () {
    const page2 = (await browser.pages())[1]
    // 等待元素加载完毕
    await page2.waitForSelector('.TopicList')
    // console.log(
    //   browser.pages().then(res => {
    //     console.log(res.length)
    //   })
    // )
    const result = await page2.evaluate(() => {
      const comiusData = []
      const imgCover = document.querySelector('.left> .imgCover').src
      const title = document.querySelector('.right>.title').innerHTML
      const author = document.querySelector('.right>.nickname').innerHTML
      const comicInfo = document.querySelector('.detailsBox>p').innerHTML
      const score = document.querySelector('.btnListRight >.laud').innerText
      const TopicItems = document.querySelectorAll('.TopicItem')
      const comiusItems = []
      TopicItems.forEach(item => {
        const cover = item.querySelector('.cover>a>.imgCover').src
        const title = item.querySelector('.title>a>span').innerHTML
        const score = item.querySelector('.laud>span').innerText
        const date = item.querySelector('.date>span').innerHTML
        console.log(cover, title, score, date)
        comiusItems.push({
          cover,
          title,
          score,
          date
        })
      })
      comiusData.push({
        imgCover,
        title,
        comicInfo,
        author,
        score,
        comiusItems
      })
      return comiusData
    })
    console.log(result)
    // 处理完数据跳转至第三个页面
    const pageSubmit = await page2.$('.btnListLeft > .firstBtn')
    await pageSubmit.click()
  }

  async function handleComiusData () {
    const page3 = (await browser.pages())[1]
    await page3.waitForSelector('.listBox')
    // 获取当前漫画总章节,标题也在 list 里面,所有减一
    const allChapter = await page3.$$('.listBox>.list>li')
    console.log(allChapter.length)
    for (let i = 0; i < allChapter.length; i++) {
      await page3.waitForSelector('.AdjacentChapters>.cls')
      // 找到下一章按钮
      const comiusSubmit = await page3.$$('.AdjacentChapters>.cls>li>a')
      await comiusSubmit[3].click()
      await page3.waitFor(2500)
      await getPageImgData()
      // 一个章节爬取完毕以后稍微歇歇，不然太快会把你当成机器人弹出验证码（虽然我们本来就是机器人）
      await page.waitFor(2500)
    }

    async function getPageImgData () {
      const resultData = await page3.evaluate(() => {
        let obj = []
        // 找到当前章节漫画图片
        const title = document.querySelector('.titleBox>h3').innerText
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
        return obj
      })
      console.log(resultData)
      let logStream = fs.createWriteStream('comiusData.json', { flags: 'a' })
      logStream.write(JSON.stringify(resultData), () => {
        log(chalk.red('数据添加完毕'))
      })
    }
  }
})()
