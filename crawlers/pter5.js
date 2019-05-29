// 自动上传审核截图到苹果后台应用
const puppeteer = require('puppeteer')
const readlineSync = require('readline-sync');
(async () => {
  const appleUser = readlineSync.question('请输入你的apple账号: ')
  const applePass = readlineSync.question('请输入你的apple密码: ')

  const browser = await puppeteer.launch({ headless: false })
  const page = (await browser.pages())[0]
  // 切换iframe框代码
  await page.goto('https://appstoreconnect.apple.com/login')
  await page.setViewport({ width: 1000, height: 800 })
  // 等待我的iframe出现
  await page.waitFor('#idms-auth-container>iframe')
  // 通过索引得到我的iframe
  const frame = (await page.frames())[1]
  // 等待用户名输入框出现
  await frame.waitFor('#account_name_text_field')
  // 输入密码
  await frame.type('#account_name_text_field', appleUser, {
    delay: 100
  })
  await frame.waitFor('#sign-in')
  await frame.click('#sign-in')
  // 等待密码框出现
  await frame.waitFor('#password_text_field')
  // 输入密码
  await frame.type('#password_text_field', applePass, { delay: 100 })
  await frame.click('#sign-in')

  const appleCode = readlineSync.question('请输入你的验证码: ')
  // 等待验证码框出现
  await frame.waitFor('.security-code-container')
  await frame.type('.security-code-container>div input', appleCode, {
    delay: 100
  })
  // 等待提示框出现
  await frame.waitFor('.not-now-btn')
  await frame.click('.not-now-btn')

  // 页面操作
  await page.waitFor('.main-nav-item')
  await page.evaluate(() => {
    console.log('----------')
    console.log('-----页面中进行操作-------')
    document.querySelector('.main-nav-item >a').click()
    // document.querySelector('.main-nav-item >a').click()
    // console.log($)
    // console.log($('.itc-logo-alt'))
    console.log('------------')
  })
  page.on('console', msg => {
    console.log(msg._text)
  })
  //   await browser.close();
})()
