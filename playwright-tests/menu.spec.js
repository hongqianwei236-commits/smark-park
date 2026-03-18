const { test, expect } = require('@playwright/test')

test.describe('菜单导航测试', () => {
  // 每个测试前先登录
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[placeholder="用户名"]').fill('admin')
    await page.locator('input[placeholder="密码"]').fill('admin123')
    await page.locator('button:has-text("登录")').click()
    await expect(page.locator('.sidebar')).toBeVisible({ timeout: 5000 })
  })

  test('测试「租户管理」→「租户列表」导航', async ({ page }) => {
    // 点击租户管理菜单
    await page.locator('.el-sub-menu__title:has-text("租户管理")').click()
    
    // 等待子菜单展开
    await page.waitForTimeout(300)
    
    // 点击租户列表
    await page.locator('.el-menu-item:has-text("租户列表")').first().click()
    
    // 验证页面内容
    await expect(page.locator('text=租户列表')).toBeVisible()
    await expect(page.locator('.el-table')).toBeVisible()
    
    // 截图
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/05-menu-tenant-list.png',
      fullPage: true 
    })
    
    console.log('✅ 租户列表菜单导航测试通过')
  })

  test('测试「项目管理」→「项目列表」导航', async ({ page }) => {
    // 点击项目管理菜单
    await page.locator('.el-sub-menu__title:has-text("项目管理")').click()
    
    // 等待子菜单展开
    await page.waitForTimeout(300)
    
    // 点击项目列表
    await page.locator('.el-menu-item:has-text("项目列表")').click()
    
    // 验证页面内容
    await expect(page.locator('text=项目列表')).toBeVisible()
    await expect(page.locator('.el-table')).toBeVisible()
    
    // 截图
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/06-menu-project-list.png',
      fullPage: true 
    })
    
    console.log('✅ 项目列表菜单导航测试通过')
  })

  test('测试「资产管理」→「楼栋管理」→「楼栋列表」导航', async ({ page }) => {
    // 点击资产管理菜单
    await page.locator('.el-sub-menu__title:has-text("资产管理")').click()
    
    // 等待子菜单展开
    await page.waitForTimeout(300)
    
    // 点击楼栋管理
    await page.locator('.el-sub-menu__title:has-text("楼栋管理")').click()
    
    // 等待三级菜单展开
    await page.waitForTimeout(300)
    
    // 点击楼栋列表
    await page.locator('.el-menu-item:has-text("楼栋列表")').click()
    
    // 验证页面内容
    await expect(page.locator('text=楼栋列表')).toBeVisible()
    await expect(page.locator('.el-table')).toBeVisible()
    
    // 截图
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/07-menu-building-list.png',
      fullPage: true 
    })
    
    console.log('✅ 楼栋列表菜单导航测试通过')
  })

  test('测试「合同管理」→「合同列表」导航', async ({ page }) => {
    // 点击合同管理菜单
    await page.locator('.el-sub-menu__title:has-text("合同管理")').click()
    
    // 等待子菜单展开
    await page.waitForTimeout(300)
    
    // 点击合同列表
    await page.locator('.el-menu-item:has-text("合同列表")').first().click()
    
    // 验证页面内容
    await expect(page.locator('text=合同列表')).toBeVisible()
    await expect(page.locator('.el-table')).toBeVisible()
    
    // 截图
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/08-menu-contract-list.png',
      fullPage: true 
    })
    
    console.log('✅ 合同列表菜单导航测试通过')
  })

  test('测试所有 4 级菜单展开', async ({ page }) => {
    // 1. 租户管理
    await page.locator('.el-sub-menu__title:has-text("租户管理")').click()
    await page.waitForTimeout(200)
    await expect(page.locator('.el-menu-item:has-text("租户列表")').first()).toBeVisible()
    await expect(page.locator('.el-menu-item:has-text("租户分析")')).toBeVisible()
    
    // 2. 项目管理
    await page.locator('.el-sub-menu__title:has-text("项目管理")').click()
    await page.waitForTimeout(200)
    await expect(page.locator('.el-menu-item:has-text("项目列表")')).toBeVisible()
    await expect(page.locator('.el-menu-item:has-text("项目报表")')).toBeVisible()
    
    // 3. 资产管理（三级菜单）
    await page.locator('.el-sub-menu__title:has-text("资产管理")').click()
    await page.waitForTimeout(200)
    await expect(page.locator('.el-sub-menu__title:has-text("楼栋管理")')).toBeVisible()
    await expect(page.locator('.el-sub-menu__title:has-text("房间管理")')).toBeVisible()
    
    // 展开楼栋管理
    await page.locator('.el-sub-menu__title:has-text("楼栋管理")').click()
    await page.waitForTimeout(200)
    await expect(page.locator('.el-menu-item:has-text("楼栋列表")').first()).toBeVisible()
    
    // 展开房间管理
    await page.locator('.el-sub-menu__title:has-text("房间管理")').click()
    await page.waitForTimeout(200)
    await expect(page.locator('.el-menu-item:has-text("房间列表")')).toBeVisible()
    
    // 4. 合同管理
    await page.locator('.el-sub-menu__title:has-text("合同管理")').click()
    await page.waitForTimeout(200)
    await expect(page.locator('.el-menu-item:has-text("合同列表")').first()).toBeVisible()
    await expect(page.locator('.el-menu-item:has-text("合同审批")')).toBeVisible()
    await expect(page.locator('.el-menu-item:has-text("合同模板")')).toBeVisible()
    
    // 截图：所有菜单展开
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/09-all-menus-expanded.png',
      fullPage: true 
    })
    
    console.log('✅ 所有 4 级菜单测试通过')
  })
})
