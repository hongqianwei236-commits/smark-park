import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  const isCollapse = ref(false)

  const menuData = ref([
    {
      path: '/tenant',
      name: '租户管理',
      icon: 'User',
      children: [
        { path: '/tenant/list', name: '租户列表' },
        { path: '/tenant/analytics', name: '租户分析' }
      ]
    },
    {
      path: '/project',
      name: '项目管理',
      icon: 'OfficeBuilding',
      children: [
        { path: '/project/list', name: '项目列表' },
        { path: '/project/report', name: '项目报表' }
      ]
    },
    {
      path: '/asset',
      name: '资产管理',
      icon: 'House',
      children: [
        {
          path: '/asset/building',
          name: '楼栋管理',
          children: [
            { path: '/asset/building/list', name: '楼栋列表' }
          ]
        },
        {
          path: '/asset/room',
          name: '房间管理',
          children: [
            { path: '/asset/room/list', name: '房间列表' }
          ]
        }
      ]
    },
    {
      path: '/contract',
      name: '合同管理',
      icon: 'Document',
      children: [
        { path: '/contract/list', name: '合同列表' },
        { path: '/contract/approval', name: '合同审批' },
        { path: '/contract/template', name: '合同模板' }
      ]
    }
  ])

  function toggleCollapse() {
    isCollapse.value = !isCollapse.value
  }

  return {
    isCollapse,
    menuData,
    toggleCollapse
  }
})
