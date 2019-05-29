// 豆瓣多个页面爬取，但是一次只能爬一条！！！！
const puppeteer = require('puppeteer')
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = (await browser.pages())[0]
  await page.goto('https://movie.douban.com/tag/#/?sort=U&range=6,10&tags=', {
    waitUntil: 'networkidle2'
  })
  await page.screenshot({ path: 'douban.png' })
  await page.setViewport({ width: 1200, height: 800 })
  await page.waitForSelector('.more')

  // 浏览器延迟
  for (let i = 0; i < 1; i++) {
    await page.waitFor(1000)
    await page.click('.more')
  }
  let data = []
  let result = await page.evaluate(() => {
    let $ = window.$
    let item = $('.list-wp a')[0]
    let it = $(item)
    if (!it) return
    let link = it.attr('href')
    let doubanId = it.find('div').data('id')
    let poster = it
      .find('img')
      .attr('src')
      .replace('s_ratio', 'l_ratio')
    let title = it.find('.title').text()
    let rate = it.find('.rate').text()
    return {
      link,
      doubanId,
      poster,
      title,
      rate
    }
  })
  let video
  if (result.link) {
    await page.goto(result.link, {
      waitUntil: 'networkidle2'
    })
    // await page.waitFor(2000)
    video = await page.evaluate(() => {
      let $ = window.$
      let it = $('.related-pic-video')
      if (!it) return
      let videoLink = it.attr('href')
      let cover = it
        .css('background-image')
        .replace('url("', '')
        .replace('")', '')
      return {
        videoLink,
        cover
      }
    })
  }

  let videoAddress
  if (video.videoLink) {
    await page.goto(video.videoLink, {
      waitUntil: 'networkidle2'
    })
    // await page.waitFor(2000)
    videoAddress = await page.evaluate(() => {
      let $ = window.$
      let it = $('source')
      if (it && it.length > 0) {
        return it.attr('src')
      }
    })
  }
  let repet = { ...video, ...result, video_url: videoAddress }
  data.push(repet)
  await page.goBack()
  console.log(data)
  await browser.close()

  fs.writeFile('douban.json', JSON.stringify(result), err => {
    if (err) console.log(err)
    console.log('创建文件成功')
  })
})()
