const bcrypt = require('bcryptjs');

// 智慧园区完整数据库模型
class MemoryDB {
  constructor() {
    this.tables = {
      // 用户与权限
      users: [],
      roles: [],
      permissions: [],
      
      // 数据中心
      dashboards: [],
      workbench_shortcuts: [],
      
      // 空间管理
      projects: [],
      buildings: [],
      rooms: [],
      parking_lots: [],
      parking_areas: [],
      parking_spaces: [],
      parking_types: [],
      
      // 招商管理
      clues: [],
      investment_teams: [],
      investment_users: [],
      channels: [],
      commissions: [],
      
      // 客商管理
      landlords: [],
      tenants: [],
      suppliers: [],
      
      // 合同管理
      contracts: [],
      contract_types: [],
      
      // 财务管理
      income_bills: [],
      expense_bills: [],
      cash_flows: [],
      expense_subjects: [],
      cost_centers: [],
      invoice_types: [],
      fee_types: [],
      payment_methods: [],
      
      // 物业管理
      complaints: [],
      repairs: [],
      meters: [],
      warehouses: [],
      warehouse_items: [],
      assets: [],
      patrol_routes: [],
      documents: [],
      
      // 运营管理
      checkins: [],
      checkouts: [],
      venues: [],
      visitor_records: [],
      activities: [],
      announcements: [],
      settled_companies: [],
      access_devices: [],
      
      // 字典
      clue_sources: [],
      room_usages: [],
      payment_types: [],
      industries: []
    };
    
    this.idCounters = {};
    Object.keys(this.tables).forEach(table => {
      this.idCounters[table] = 1;
    });
    
    this.initData();
  }

  prepare(sql) {
    const self = this;
    return {
      get: function(...params) {
        const countMatch = sql.match(/SELECT\s+COUNT\(\*\)\s+as\s+total\s+FROM\s+(\w+)/i);
        if (countMatch) {
          const table = countMatch[1];
          let data = self.tables[table];
          const whereMatch = sql.match(/WHERE\s+(.+)$/i);
          if (whereMatch) {
            data = self.applyWhere(data, whereMatch[1], params);
          }
          return { total: data.length };
        }
        const singleMatch = sql.match(/SELECT\s+\*\s+FROM\s+(\w+)\s+WHERE\s+(\w+)\s*=\s*\?/i);
        if (singleMatch) {
          const [, table, field] = singleMatch;
          return self.tables[table].find(item => item[field] == params[0]);
        }
        return null;
      },
      all: function(...params) {
        const selectMatch = sql.match(/SELECT\s+(.+)\s+FROM\s+(\w+)(?:\s+AS\s+\w+)?/i);
        if (selectMatch) {
          const [, columns, table] = selectMatch;
          let results = [...self.tables[table]];
          const whereMatch = sql.match(/WHERE\s+(.+?)(?=ORDER|LIMIT|$)/i);
          if (whereMatch) {
            results = self.applyWhere(results, whereMatch[1], params);
          }
          const orderMatch = sql.match(/ORDER\s+BY\s+(\w+)(?:\.(\w+))?\s*(DESC|ASC)?/i);
          if (orderMatch) {
            const field = orderMatch[2] || orderMatch[1];
            const direction = orderMatch[3] || 'ASC';
            results.sort((a, b) => {
              const va = a[field], vb = b[field];
              return direction === 'DESC' ? (vb > va ? 1 : -1) : (va > vb ? 1 : -1);
            });
          }
          const limitMatch = sql.match(/LIMIT\s+(\d+)\s+OFFSET\s+(\d+)/i);
          if (limitMatch) {
            results = results.slice(parseInt(limitMatch[2]), parseInt(limitMatch[2]) + parseInt(limitMatch[1]));
          }
          return results;
        }
        return [];
      },
      run: function(...params) {
        const insertMatch = sql.match(/INSERT\s+INTO\s+(\w+)\s+\(([^)]+)\)\s+VALUES\s+\(([^)]+)\)/i);
        if (insertMatch) {
          const [, table, fields] = insertMatch;
          const fieldNames = fields.split(',').map(f => f.trim());
          const newItem = { id: self.idCounters[table]++ };
          fieldNames.forEach((field, idx) => { newItem[field] = params[idx]; });
          if (!newItem.created_at) newItem.created_at = new Date().toISOString();
          self.tables[table].push(newItem);
          return { lastInsertRowid: newItem.id, changes: 1 };
        }
        const updateMatch = sql.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+id\s*=\s*\?/i);
        if (updateMatch) {
          const [, table, setClause] = updateMatch;
          const id = params[params.length - 1];
          const item = self.tables[table].find(i => i.id === id);
          if (item) {
            const sets = setClause.split(',').map(s => s.trim());
            sets.forEach((set, idx) => {
              const [field] = set.split('=');
              item[field.trim()] = params[idx];
            });
            item.updated_at = new Date().toISOString();
            return { changes: 1 };
          }
          return { changes: 0 };
        }
        const deleteMatch = sql.match(/DELETE\s+FROM\s+(\w+)\s+WHERE\s+id\s*=\s*\?/i);
        if (deleteMatch) {
          const [, table] = deleteMatch;
          const idx = self.tables[table].findIndex(i => i.id === params[0]);
          if (idx > -1) { self.tables[table].splice(idx, 1); return { changes: 1 }; }
          return { changes: 0 };
        }
        return { changes: 0 };
      }
    };
  }
  
  applyWhere(data, whereClause, params) {
    let paramIdx = 0;
    return data.filter(item => {
      const conditions = whereClause.split(/\s+AND\s+/i);
      return conditions.every(cond => {
        const likeMatch = cond.match(/(\w+)\s+LIKE\s+\?/i);
        if (likeMatch) {
          const field = likeMatch[1], pattern = params[paramIdx++];
          const value = item[field];
          if (!value) return false;
          return new RegExp(pattern.replace(/%/g, '.*'), 'i').test(value);
        }
        const eqMatch = cond.match(/(\w+)\s*=\s*\?/i);
        if (eqMatch) return item[eqMatch[1]] == params[paramIdx++];
        return true;
      });
    });
  }
  
  exec(sql) {}
  
  insert(table, data) {
    const newItem = { id: this.idCounters[table]++, ...data, created_at: data.created_at || new Date().toISOString() };
    this.tables[table].push(newItem);
    return newItem;
  }
  
  update(table, id, data) {
    const item = this.tables[table].find(i => i.id === id);
    if (item) { Object.assign(item, data, { updated_at: new Date().toISOString() }); return item; }
    return null;
  }
  
  delete(table, id) {
    const idx = this.tables[table].findIndex(i => i.id === id);
    if (idx > -1) { this.tables[table].splice(idx, 1); return true; }
    return false;
  }
  
  findById(table, id) { return this.tables[table].find(i => i.id === id); }
  
  findWhere(table, condition) {
    return this.tables[table].filter(item => {
      return Object.keys(condition).every(key => item[key] === condition[key]);
    });
  }
  
  getTable(table) { return this.tables[table]; }
  
  initData() {
    const hashedPassword = require('bcryptjs').hashSync('admin123', 10);
    this.insert('users', { username: 'admin', password: hashedPassword, name: '管理员', role: 'admin' });
    this.initDictionaries();
    this.initProjects();
    this.initInvestment();
    this.initFinance();
    this.initProperty();
    this.initOperation();
  }
  
  initDictionaries() {
    ['58同城', '天猫', '安居客', '官网', '电话咨询'].forEach(n => this.insert('clue_sources', { name: n }));
    ['办公', '研发', '生产', '仓储'].forEach(n => this.insert('room_usages', { name: n }));
    ['月付', '季付', '半年付', '年付'].forEach(n => this.insert('payment_types', { name: n }));
    ['科技', '金融', '制造', '医疗'].forEach(n => this.insert('industries', { name: n }));
    ['租金', '物业费', '水电费', '停车费'].forEach(n => this.insert('fee_types', { name: n }));
    ['银行转账', '现金', '支付宝', '微信'].forEach(n => this.insert('payment_methods', { name: n }));
    ['普通车位', 'VIP车位', '充电车位'].forEach(n => this.insert('parking_types', { name: n }));
    ['增值税普通发票', '增值税专用发票', '普通收据', '不开发票'].forEach(n => this.insert('invoice_types', { name: n }));
    ['租赁合同', '物业服务合同', '车位租赁合同'].forEach(n => this.insert('contract_types', { name: n }));
  }
  
  initProjects() {
    this.insert('projects', { name: '科技创新园', short_name: '科创园', code: 'KC001', city: '苏州市', address: '科技大道1号', total_area: 50000, rentable_area: 45000 });
    this.insert('projects', { name: '智能制造园', short_name: '智造园', code: 'ZZ001', city: '苏州市', address: '智造路2号', total_area: 80000, rentable_area: 72000 });
    this.insert('buildings', { project_id: 1, name: 'A栋', floors: 10, total_area: 10000, rentable_area: 9000 });
    this.insert('buildings', { project_id: 1, name: 'B栋', floors: 8, total_area: 8000, rentable_area: 7200 });
    for (let b = 1; b <= 2; b++) {
      for (let f = 1; f <= 5; f++) {
        for (let r = 1; r <= 4; r++) {
          const area = 80 + Math.floor(Math.random() * 120);
          this.insert('rooms', { building_id: b, room_no: `${f}0${r}`, floor: f, area, rentable_area: area * 0.9, price: area * 3, status: Math.random() > 0.5 ? 'vacant' : 'occupied' });
        }
      }
    }
    this.insert('parking_lots', { project_id: 1, name: 'A区停车场', location: '地下一层', total_spaces: 100 });
    this.insert('parking_areas', { parking_lot_id: 1, name: 'A-1区' });
    for (let i = 1; i <= 10; i++) {
      this.insert('parking_spaces', { parking_area_id: 1, space_no: `A-1-${String(i).padStart(3, '0')}`, status: Math.random() > 0.7 ? 'occupied' : 'vacant', parking_type_id: 1 });
    }
  }
  
  initInvestment() {
    this.insert('investment_teams', { name: '招商一组', project_id: 1, member_count: 5 });
    this.insert('commissions', { name: '标准佣金', rate: 0.5 });
    this.insert('clues', { name: '张三', phone: '13800138001', company: '新创科技', source_id: 1, project_id: 1, status: 'pending' });
    this.insert('clues', { name: '李四', phone: '13800138002', company: '未来智能', source_id: 2, project_id: 1, status: 'following' });
    this.insert('channels', { name: '中介合作', contact: '中介张', phone: '13900139001', commission_rate: 0.5 });    this.insert('investment_users', { name: 'xbkj', phone: '13800000001', team: '招商一组' });
    this.insert('investment_users', { name: '顾佳露', phone: '13800000002', team: '招商一组' });
    this.insert('investment_users', { name: '信廜', phone: '13800000003', team: '招商一组' });
    this.insert('investment_users', { name: '王工', phone: '13800000004', team: '' });
    this.insert('investment_users', { name: '陈西娟', phone: '13800000005', team: '' });
    this.insert('investment_users', { name: '陶玲玲', phone: '13800000006', team: '' });
    this.insert('investment_users', { name: '刘胜男', phone: '13800000007', team: '' });  }
  
  initFinance() {
    this.insert('tenants', { name: '科技创新公司', type: 'enterprise', contact: '张经理', phone: '13800138001', credit_code: '91320000MA1A2B3C' });
    this.insert('tenants', { name: '智能制造科技', type: 'enterprise', contact: '李总', phone: '13800138002', credit_code: '91320000MA4B5C6D' });
    this.insert('suppliers', { name: '物业公司', contact: '陈经理', phone: '13700137001' });
    this.insert('landlords', { name: '园区运营公司', short_name: '运营公司', credit_code: '91320000MA5D6E7F', legal_person: '王总', phone: '0512-12345678', email: 'admin@park.com', status: 'active' });
    this.insert('contracts', { tenant_id: 1, room_id: 1, contract_no: 'HT2024001', start_date: '2024-01-01', end_date: '2025-12-31', amount: 360000, status: 'active' });
    this.insert('income_bills', { contract_id: 1, tenant_id: 1, bill_month: '2024-01', amount: 30000, status: 'paid' });
    this.insert('expense_bills', { payer: '园区公司', payee: '物业公司', amount: 50000, status: 'unpaid' });
    this.insert('expense_subjects', { name: '物业服务费', code: 'EXP001' });
    this.insert('cost_centers', { name: '运营中心', code: 'CC001', project_id: 1 });
  }
  
  initProperty() {
    this.insert('complaints', { tenant_id: 1, type: 'complaint', content: '电梯故障', status: 'pending' });
    this.insert('repairs', { tenant_id: 1, room_id: 1, type: 'electric', content: '空调不制冷', status: 'pending' });
    this.insert('meters', { room_id: 1, type: 'electric', meter_no: 'ELEC001' });
    this.insert('warehouses', { name: 'A栋仓库', location: '负一层' });
    this.insert('assets', { name: '中央空调', category: '设备', location: 'A栋', purchase_amount: 500000 });
    this.insert('patrol_routes', { name: '日间巡更', points: '大门,电梯,走廊' });
    this.insert('documents', { name: '管理制度', category: '制度', version: '1.0' });
  }
  
  initOperation() {
    this.insert('settled_companies', { tenant_id: 1, company_name: '科技创新公司', settled_date: '2024-01-01', area: 120 });
    this.insert('venues', { name: '会议室', location: 'A栋3层', capacity: 50, price: 500 });
    this.insert('activities', { title: '企业交流会', date: '2024-04-15', location: '会议室' });
    this.insert('announcements', { title: '放假通知', content: '清明节放假', type: 'notice' });
    this.insert('access_devices', { name: 'A栋大门', type: 'face', location: '一层' });
    this.insert('visitor_records', { visitor_name: '访客张', visited_company: '科技创新公司', visit_time: new Date().toISOString() });
  }
}

module.exports = new MemoryDB();
