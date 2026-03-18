const { test, expect } = require('@playwright/test')

test.describe('登录测试', () => {
  test('用户成功登录并跳转到首页', async ({ page }) => {
    // 访问登录页面
    await page.goto('/login')
    
    // 等待页面加载完成
    await expect(page.locator('.login-container')).toBeVisible()
    
    // 截图：登录页面
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/01-login-page.png',
      fullPage: true 
    })
    
    // 输入用户名
    await page.locator('input[placeholder="用户名"]').fill('admin')
    
    // 输入密码
    await page.locator('input[placeholder="密码"]').fill('admin123')
    
    // 截图：填写登录信息
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/02-login-filled.png',
      fullPage: true 
    })
    
    // 点击登录按钮
    await page.locator('button:has-text("登录")').click()
    
    // 等待跳转到首页，验证侧边栏菜单出现
    await expect(page.locator('.sidebar')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('.el-menu')).toBeVisible()
    
    // 验证页面标题
    await expect(page).toHaveTitle(/智慧园区/)
    
    // 截图：登录成功后的首页
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/03-login-success-home.png',
      fullPage: true 
    })
    
    console.log('✅ 登录测试通过：成功登录并跳转到首页')
  })

  test('登录失败显示错误信息', async ({ page }) => {
    await page.goto('/login')
    
    // 输入错误的密码
    await page.locator('input[placeholder="用户名"]').fill('admin')
    await page.locator('input[placeholder="密码"]').fill('wrongpassword')
    
    // 点击登录按钮
    await page.locator('button:has-text("登录")').click()
    
    // 等待错误消息
    await expect(page.locator('.el-message--error')).toBeVisible({ timeout: 5000 })
    
    // 截图：登录失败
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/04-login-failed.png',
      fullPage: true 
    })
    
    console.log('✅ 登录失败测试通过：正确显示错误信息')
  })
})
