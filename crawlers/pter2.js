const puppeteer = require('puppeteer')
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = (await browser.pages())[0]
  await page.goto('https://movie.douban.com/tag/#/?sort=U&range=6,10&tags=', {
    width: 'networkidle2'
  })
  await page.screenshot({ path: 'douban.png' })
  await page.setViewport({ width: 1200, height: 800 })
  await page.waitForSelector('.more')

  // 浏览器延迟关闭
  for (let i = 0; i < 10; i++) {
    await page.waitFor(3000)
    await page.click('.more')
  }

  let result = await page.evaluate(() => {
    let $ = window.$
    let items = $('.list-wp a')
    let links = []
    if (items && items.length > 0) {
      items.each((idx, item) => {
        let it = $(item)
        let link = it.attr('href')
        let doubanId = it.find('div').data('id')
        let cover = it
          .find('img')
          .attr('src')
          .replace('s_ratio', 'l_ratio')
        let title = it.find('.title').text()
        let rate = it.find('.rate').text()
        links.push({
          link,
          doubanId,
          cover,
          title,
          rate
        })
      })
    }
    return links
  })

  await browser.close()

  fs.writeFile('douban.json', JSON.stringify(result), err => {
    if (err) console.log(err)
    console.log('创建文件成功')
  })
})()
