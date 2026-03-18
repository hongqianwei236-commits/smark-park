import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data?.error || '请求失败')
  }
)

// 认证API
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me')
}

// 租户API
export const tenantApi = {
  getList: (params) => api.get('/tenants', { params }),
  getById: (id) => api.get(`/tenants/${id}`),
  create: (data) => api.post('/tenants', data),
  update: (id, data) => api.put(`/tenants/${id}`, data),
  delete: (id) => api.delete(`/tenants/${id}`)
}

// 项目API
export const projectApi = {
  getList: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`)
}

// 楼栋API
export const buildingApi = {
  getList: (params) => api.get('/buildings', { params }),
  getById: (id) => api.get(`/buildings/${id}`),
  create: (data) => api.post('/buildings', data),
  update: (id, data) => api.put(`/buildings/${id}`, data),
  delete: (id) => api.delete(`/buildings/${id}`)
}

// 房间API
export const roomApi = {
  getList: (params) => api.get('/rooms', { params }),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`)
}

// 合同API
export const contractApi = {
  getList: (params) => api.get('/contracts', { params }),
  getById: (id) => api.get(`/contracts/${id}`),
  create: (data) => api.post('/contracts', data),
  update: (id, data) => api.put(`/contracts/${id}`, data),
  delete: (id) => api.delete(`/contracts/${id}`)
}

// 招商API
export const investmentApi = {
  getStaff: (params) => api.get('/investment/staff', { params }),
  createStaff: (data) => api.post('/investment/staff', data),
  updateStaff: (id, data) => api.put(`/investment/staff/${id}`, data),
  deleteStaff: (id) => api.delete(`/investment/staff/${id}`),
  getTeams: (params) => api.get('/investment/teams', { params }),
  createTeam: (data) => api.post('/investment/teams', data),
  updateTeam: (id, data) => api.put(`/investment/teams/${id}`, data),
  deleteTeam: (id) => api.delete(`/investment/teams/${id}`),
  getChannels: (params) => api.get('/investment/channels', { params }),
  createChannel: (data) => api.post('/investment/channels', data),
  getCommissions: () => api.get('/investment/commissions'),
  createCommission: (data) => api.post('/investment/commissions', data),
}

// 财务API
export const financeApi = {
  getIncomeBills: (params) => api.get('/finance/income-bills', { params }),
  createIncomeBill: (data) => api.post('/finance/income-bills', data),
  verifyIncomeBill: (id, data) => api.post(`/finance/income-bills/${id}/verify`, data),
  getExpenseBills: (params) => api.get('/finance/expense-bills', { params }),
  createExpenseBill: (data) => api.post('/finance/expense-bills', data),
  getCashFlows: (params) => api.get('/finance/cash-flows', { params }),
  getFeeTypes: () => api.get('/finance/fee-types'),
  createFeeType: (data) => api.post('/finance/fee-types', data),
  updateFeeType: (id, data) => api.put(`/finance/fee-types/${id}`, data),
  deleteFeeType: (id) => api.delete(`/finance/fee-types/${id}`),
  getPaymentMethods: () => api.get('/finance/payment-methods'),
  createPaymentMethod: (data) => api.post('/finance/payment-methods', data),
  updatePaymentMethod: (id, data) => api.put(`/finance/payment-methods/${id}`, data),
  deletePaymentMethod: (id) => api.delete(`/finance/payment-methods/${id}`),
  getInvoiceTypes: () => api.get('/finance/invoice-types'),
  createInvoiceType: (data) => api.post('/finance/invoice-types', data),
  updateInvoiceType: (id, data) => api.put(`/finance/invoice-types/${id}`, data),
  deleteInvoiceType: (id) => api.delete(`/finance/invoice-types/${id}`),
  getExpenseSubjects: () => api.get('/finance/expense-subjects'),
  createExpenseSubject: (data) => api.post('/finance/expense-subjects', data),
  updateExpenseSubject: (id, data) => api.put(`/finance/expense-subjects/${id}`, data),
  deleteExpenseSubject: (id) => api.delete(`/finance/expense-subjects/${id}`),
  getCostCenters: () => api.get('/finance/cost-centers'),
  createCostCenter: (data) => api.post('/finance/cost-centers', data),
  updateCostCenter: (id, data) => api.put(`/finance/cost-centers/${id}`, data),
  deleteCostCenter: (id) => api.delete(`/finance/cost-centers/${id}`),
}

// 合同类型API
export const contractTypeApi = {
  getList: () => api.get('/contracts/types'),
  create: (data) => api.post('/contracts/types', data),
  update: (id, data) => api.put(`/contracts/types/${id}`, data),
  delete: (id) => api.delete(`/contracts/types/${id}`),
}

// 商户API
export const merchantApi = {
  getLandlords: () => api.get('/merchant/landlords'),
  createLandlord: (data) => api.post('/merchant/landlords', data),
  updateLandlord: (id, data) => api.put(`/merchant/landlords/${id}`, data),
  deleteLandlord: (id) => api.delete(`/merchant/landlords/${id}`),
  getSuppliers: (params) => api.get('/merchant/suppliers', { params }),
  createSupplier: (data) => api.post('/merchant/suppliers', data),
  updateSupplier: (id, data) => api.put(`/merchant/suppliers/${id}`, data),
  deleteSupplier: (id) => api.delete(`/merchant/suppliers/${id}`),
}

// 物业API
export const propertyApi = {
  getComplaints: (params) => api.get('/property/complaints', { params }),
  updateComplaint: (id, data) => api.put(`/property/complaints/${id}`, data),
  getRepairs: (params) => api.get('/property/repairs', { params }),
  updateRepair: (id, data) => api.put(`/property/repairs/${id}`, data),
}

// 运营API
export const operationApi = {
  getVenues: (params) => api.get('/operation/venues', { params }),
  createVenue: (data) => api.post('/operation/venues', data),
  getActivities: (params) => api.get('/operation/activities', { params }),
  createActivity: (data) => api.post('/operation/activities', data),
  getAnnouncements: (params) => api.get('/operation/announcements', { params }),
  createAnnouncement: (data) => api.post('/operation/announcements', data),
  deleteAnnouncement: (id) => api.delete(`/operation/announcements/${id}`),
}

export default api
