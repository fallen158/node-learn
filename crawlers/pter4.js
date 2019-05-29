// 自动截取 apple 应用审核图片6张
const puppeteer = require('puppeteer')
const readlineSync = require('readline-sync');

(async () => {
  console.log(
    '---------------------这是iphone自动截图脚本-------------------------'
  )
  const screenUrl = readlineSync.question('请输入你需要截图的网站url: ')
  const screenDirection = readlineSync.question(
    '请选择你需要截图方式(横屏y,竖屏s): '
  )
  if (screenDirection !== 'y' && screenDirection !== 's') {
    console.log('请输入正确截图方式')
    return
  }
  const screenTime = readlineSync.question(
    '请输入自动截图的间隔时间(s为单位): '
  )

  let time = Number(screenTime) * 1000
  // 竖屏
  let arrVertical = [
    {
      url: screenUrl,
      time,
      img: 'pg5.5-1242*2208(1).png',
      width: 1242,
      height: 2208
    },
    {
      url: screenUrl,
      time,
      img: 'pg6.5-1242*2688(1).png',
      width: 1242,
      height: 2688
    },
    {
      url: screenUrl,
      time,
      img: 'ip-2048*2732(1).png',
      width: 2048,
      height: 2732
    },
    {
      url: screenUrl,
      time,
      img: 'pg5.5-1242*2208(2).png',
      width: 1242,
      height: 2208
    },
    {
      url: screenUrl,
      time,
      img: 'pg6.5-1242*2688(2).png',
      width: 1242,
      height: 2688
    },
    {
      url: screenUrl,
      time,
      img: 'ip-2048*2732(2).png',
      width: 2048,
      height: 2732
    },
    {
      url: screenUrl,
      time,
      img: 'pg5.5-1242*2208(3).png',
      width: 1242,
      height: 2208
    },
    {
      url: screenUrl,
      time,
      img: 'pg6.5-1242*2688(3).png',
      width: 1242,
      height: 2688
    },    
    {
      url: screenUrl,
      time,
      img: 'ip-2048*2732(3).png',
      width: 2048,
      height: 2732
    },
    {
      url: screenUrl,
      time,
      img: 'pg5.5-1242*2208(4).png',
      width: 1242,
      height: 2208
    },
    {
      url: screenUrl,
      time,
      img: 'pg6.5-1242*2688(4).png',
      width: 1242,
      height: 2688
    },
    {
      url: screenUrl,
      time,
      img: 'ip-2048*2732(4).png',
      width: 2048,
      height: 2732
    }
  ]
  // 横屏
  let arrHorizontal = [
    {
      url: screenUrl,
      time,
      img: 'pg5.5-2208*1242(1).png',
      width: 2208,
      height: 1242
    },
    {
      url: screenUrl,
      time,
      img: 'pg6.5-2688*1242(1).png',
      width: 2688,
      height: 1242
    },
    {
      url: screenUrl,
      time,
      img: 'ip-2732*2048(1).png',
      width: 2732,
      height: 2048
    },

    {
      url: screenUrl,
      time,
      img: 'pg5.5-2208*1242(2).png',
      width: 2208,
      height: 1242
    },
    {
      url: screenUrl,
      time,
      img: 'pg6.5-2688*1242(2).png',
      width: 2688,
      height: 1242
    },
    {
      url: screenUrl,
      time,
      img: 'ip-2732*2048(2).png',
      width: 2732,
      height: 2048
    },
    {
      url: screenUrl,
      time,
      img: 'pg5.5-2208*1242(3).png',
      width: 2208,
      height: 1242
    },
    {
      url: screenUrl,
      time,
      img: 'pg6.5-2688*1242(3).png',
      width: 2688,
      height: 1242
    },
    {
      url: screenUrl,
      time,
      img: 'ip-2732*2048(3).png',
      width: 2732,
      height: 2048
    },
    {
      url: screenUrl,
      time,
      img: 'pg5.5-2208*1242(4).png',
      width: 2208,
      height: 1242
    },
    {
      url: screenUrl,
      time,
      img: 'pg6.5-2688*1242(4).png',
      width: 2688,
      height: 1242
    },
    {
      url: screenUrl,
      time,
      img: 'ip-2732*2048(4).png',
      width: 2732,
      height: 2048
    }
  ]
  let arr

  let direction
  if (screenDirection === 'y') {
    direction = '横屏'
    arr = arrHorizontal
    console.log(
      `注意!!!! 你要截取的图为: ${direction} \n 1-3张为 iphone5.5，iphone6.5，ipad \n 3-6张为 phone5.5，iphone6.5，ipad  \n 7-9张为 phone5.5，iphone6.5，ipad \n 9-12张为 phone5.5，iphone6.5，ipad`
    )
  } else if (screenDirection === 's') {
    direction = '竖屏'
    arr = arrVertical
    console.log(
      `注意!!!! 你要截取的图为: ${direction} \n 1-3张为 iphone5.5，iphone6.5，ipad \n 3-6张为 phone5.5，iphone6.5，ipad  \n 7-9张为 phone5.5，iphone6.5，ipad \n 9-12张为 phone5.5，iphone6.5，ipad`
    )
  }

  console.log(
    `你的配置为:\n URL: ${screenUrl} \n Direction: ${direction} \n Time: ${screenTime} 秒`
  )

  if (readlineSync.keyInYN('准备好啦吗?')) {
    const browser = await puppeteer.launch({ headless: false, devtools: true })
    const page = (await browser.pages())[0]

    for (let i = 0; i < arr.length; i++) {
      let v = arr[i]
      await page.setViewport({ width: v.width, height: v.height })
      await page.goto(v.url)
      await page.waitFor(v.time)
      await page.screenshot({ path: v.img })
    }

    await browser.close()
  } else {
    process.exit()
  }
})()
