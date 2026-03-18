const { test, expect } = require('@playwright/test')

test.describe('租户 CRUD 增删改查测试', () => {
  // 每个测试前先登录
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[placeholder="用户名"]').fill('admin')
    await page.locator('input[placeholder="密码"]').fill('admin123')
    await page.locator('button:has-text("登录")').click()
    await expect(page.locator('.sidebar')).toBeVisible({ timeout: 5000 })
    
    // 导航到租户列表
    await page.locator('.el-sub-menu__title:has-text("租户管理")').click()
    await page.waitForTimeout(300)
    await page.locator('.el-menu-item:has-text("租户列表")').first().click()
    await expect(page.locator('text=租户列表')).toBeVisible()
  })

  test('新增租户 - 填写表单并提交', async ({ page }) => {
    // 记录当前表格行数
    const initialRows = await page.locator('.el-table__row').count()
    
    // 点击新增按钮
    await page.locator('button:has-text("新增租户")').click()
    
    // 等待对话框出现
    await expect(page.locator('.el-dialog__title:has-text("新增租户")')).toBeVisible()
    
    // 填写表单
    const testData = {
      name: `测试租户_${Date.now()}`,
      contact: '张三',
      phone: '13800138000',
      email: 'test@example.com',
      address: '北京市朝阳区测试地址'
    }
    
    await page.locator('.el-dialog__body input').nth(0).fill(testData.name)
    await page.locator('.el-dialog__body input').nth(1).fill(testData.contact)
    await page.locator('.el-dialog__body input').nth(2).fill(testData.phone)
    await page.locator('.el-dialog__body input').nth(3).fill(testData.email)
    await page.locator('.el-dialog__body textarea').fill(testData.address)
    
    // 截图：填写新增表单
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/10-tenant-add-form.png',
      fullPage: true 
    })
    
    // 点击确定提交
    await page.locator('.el-dialog__footer button:has-text("确定")').click()
    
    // 等待成功消息
    await expect(page.locator('.el-message--success:has-text("创建成功")')).toBeVisible({ timeout: 5000 })
    
    // 等待对话框关闭
    await expect(page.locator('.el-dialog__title')).not.toBeVisible()
    
    // 截图：新增成功
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/11-tenant-add-success.png',
      fullPage: true 
    })
    
    // 验证表格中显示新租户
    await expect(page.locator('.el-table__row')).toHaveCount(initialRows + 1)
    await expect(page.locator(`text=${testData.name}`)).toBeVisible()
    
    console.log('✅ 新增租户测试通过')
  })

  test('编辑租户 - 修改租户信息', async ({ page }) => {
    // 确保有数据
    const rowCount = await page.locator('.el-table__row').count()
    if (rowCount === 0) {
      console.log('⚠️ 表格为空，跳过编辑测试')
      return
    }
    
    // 获取第一行的租户名称
    const firstRowName = await page.locator('.el-table__row').first().locator('td').nth(1).textContent()
    
    // 点击第一行的编辑按钮
    await page.locator('.el-table__row').first().locator('button:has-text("编辑")').click()
    
    // 等待对话框出现
    await expect(page.locator('.el-dialog__title:has-text("编辑租户")')).toBeVisible()
    
    // 修改租户名称
    const newName = `编辑后的_${Date.now()}`
    const nameInput = page.locator('.el-dialog__body input').nth(0)
    await nameInput.clear()
    await nameInput.fill(newName)
    
    // 截图：编辑表单
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/12-tenant-edit-form.png',
      fullPage: true 
    })
    
    // 点击确定提交
    await page.locator('.el-dialog__footer button:has-text("确定")').click()
    
    // 等待成功消息
    await expect(page.locator('.el-message--success:has-text("更新成功")')).toBeVisible({ timeout: 5000 })
    
    // 截图：编辑成功
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/13-tenant-edit-success.png',
      fullPage: true 
    })
    
    // 验证修改后的名称显示在表格中
    await expect(page.locator(`text=${newName}`)).toBeVisible()
    
    console.log('✅ 编辑租户测试通过')
  })

  test('删除租户 - 确认删除操作', async ({ page }) => {
    // 确保有数据
    const rowCount = await page.locator('.el-table__row').count()
    if (rowCount === 0) {
      console.log('⚠️ 表格为空，跳过删除测试')
      return
    }
    
    // 获取删除前的行数
    const initialRows = await page.locator('.el-table__row').count()
    
    // 点击第一行的删除按钮
    await page.locator('.el-table__row').first().locator('button:has-text("删除")').click()
    
    // 等待确认对话框
    await expect(page.locator('.el-message-box__title:has-text("提示")')).toBeVisible()
    
    // 截图：删除确认对话框
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/14-tenant-delete-confirm.png',
      fullPage: true 
    })
    
    // 点击确认删除
    await page.locator('.el-message-box__btns button:has-text("确定")').click()
    
    // 等待成功消息
    await expect(page.locator('.el-message--success:has-text("删除成功")')).toBeVisible({ timeout: 5000 })
    
    // 截图：删除成功
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/15-tenant-delete-success.png',
      fullPage: true 
    })
    
    // 验证表格行数减少
    await expect(page.locator('.el-table__row')).toHaveCount(initialRows - 1)
    
    console.log('✅ 删除租户测试通过')
  })

  test('完整的 CRUD 流程测试', async ({ page }) => {
    const testData = {
      name: `CRUD测试_${Date.now()}`,
      contact: '李四',
      phone: '13900139000',
      email: 'crud@example.com',
      address: '上海市浦东新区测试地址'
    }
    
    // 1. 创建
    await page.locator('button:has-text("新增租户")').click()
    await expect(page.locator('.el-dialog__title:has-text("新增租户")')).toBeVisible()
    
    await page.locator('.el-dialog__body input').nth(0).fill(testData.name)
    await page.locator('.el-dialog__body input').nth(1).fill(testData.contact)
    await page.locator('.el-dialog__body input').nth(2).fill(testData.phone)
    await page.locator('.el-dialog__body input').nth(3).fill(testData.email)
    await page.locator('.el-dialog__body textarea').fill(testData.address)
    
    await page.locator('.el-dialog__footer button:has-text("确定")').click()
    await expect(page.locator('.el-message--success:has-text("创建成功")')).toBeVisible({ timeout: 5000 })
    
    // 等待列表刷新
    await page.waitForTimeout(500)
    
    // 找到新创建的租户行
    const newRow = page.locator('.el-table__row').filter({ hasText: testData.name })
    await expect(newRow).toBeVisible()
    
    // 2. 读取（验证数据）
    const displayedName = await newRow.locator('td').nth(1).textContent()
    const displayedContact = await newRow.locator('td').nth(2).textContent()
    expect(displayedName).toBe(testData.name)
    expect(displayedContact).toBe(testData.contact)
    
    // 3. 更新
    await newRow.locator('button:has-text("编辑")').click()
    await expect(page.locator('.el-dialog__title:has-text("编辑租户")')).toBeVisible()
    
    const updatedName = `${testData.name}_已更新`
    const nameInput = page.locator('.el-dialog__body input').nth(0)
    await nameInput.clear()
    await nameInput.fill(updatedName)
    
    await page.locator('.el-dialog__footer button:has-text("确定")').click()
    await expect(page.locator('.el-message--success:has-text("更新成功")')).toBeVisible({ timeout: 5000 })
    
    // 等待列表刷新
    await page.waitForTimeout(500)
    
    // 验证更新成功
    await expect(page.locator(`text=${updatedName}`)).toBeVisible()
    
    // 4. 删除
    const updatedRow = page.locator('.el-table__row').filter({ hasText: updatedName })
    await updatedRow.locator('button:has-text("删除")').click()
    
    await expect(page.locator('.el-message-box__title:has-text("提示")')).toBeVisible()
    await page.locator('.el-message-box__btns button:has-text("确定")').click()
    
    await expect(page.locator('.el-message--success:has-text("删除成功")')).toBeVisible({ timeout: 5000 })
    
    // 等待列表刷新并验证删除
    await page.waitForTimeout(500)
    await expect(page.locator(`text=${updatedName}`)).not.toBeVisible()
    
    // 截图：完整 CRUD 流程完成
    await page.screenshot({ 
      path: 'playwright-tests/screenshots/16-crud-complete.png',
      fullPage: true 
    })
    
    console.log('✅ 完整 CRUD 流程测试通过')
  })
})
