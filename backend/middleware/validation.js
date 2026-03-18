// 输入验证中间件
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];
    
    // 验证参数是否存在且符合规则
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      
      // 必填验证
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rules.label || field}不能为空`);
        continue;
      }
      
      // 如果值为空且非必填，跳过其他验证
      if (!value && !rules.required) {
        continue;
      }
      
      // 类型验证
      if (rules.type) {
        switch (rules.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`${rules.label || field}必须是字符串`);
            }
            break;
          case 'number':
            if (typeof value !== 'number' || isNaN(value)) {
              errors.push(`${rules.label || field}必须是数字`);
            }
            break;
          case 'integer':
            if (!Number.isInteger(Number(value))) {
              errors.push(`${rules.label || field}必须是整数`);
            }
            break;
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              errors.push(`${rules.label || field}格式不正确`);
            }
            break;
          case 'phone':
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(value)) {
              errors.push(`${rules.label || field}格式不正确`);
            }
            break;
          case 'date':
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(value)) {
              errors.push(`${rules.label || field}日期格式必须是 YYYY-MM-DD`);
            } else {
              const date = new Date(value);
              if (isNaN(date.getTime())) {
                errors.push(`${rules.label || field}是无效日期`);
              }
            }
            break;
        }
      }
      
      // 最小长度验证
      if (rules.minLength && String(value).length < rules.minLength) {
        errors.push(`${rules.label || field}最少需要 ${rules.minLength} 个字符`);
      }
      
      // 最大长度验证
      if (rules.maxLength && String(value).length > rules.maxLength) {
        errors.push(`${rules.label || field}最多 ${rules.maxLength} 个字符`);
      }
      
      // 最小值验证
      if (rules.min !== undefined && Number(value) < rules.min) {
        errors.push(`${rules.label || field}不能小于 ${rules.min}`);
      }
      
      // 最大值验证
      if (rules.max !== undefined && Number(value) > rules.max) {
        errors.push(`${rules.label || field}不能大于 ${rules.max}`);
      }
      
      // 枚举值验证
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${rules.label || field}必须是以下值之一: ${rules.enum.join(', ')}`);
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('; ') });
    }
    
    next();
  };
};

// 分页参数验证中间件
const validatePagination = (req, res, next) => {
  let { page = 1, pageSize = 10 } = req.query;
  
  page = parseInt(page);
  pageSize = parseInt(pageSize);
  
  // 验证 page
  if (isNaN(page) || page < 1) {
    return res.status(400).json({ error: '页码必须是大于0的整数' });
  }
  
  // 验证 pageSize
  if (isNaN(pageSize) || pageSize < 1) {
    return res.status(400).json({ error: '每页数量必须是大于0的整数' });
  }
  
  // 限制最大页大小
  if (pageSize > 100) {
    pageSize = 100;
  }
  
  // 将验证后的值保存到请求对象
  req.query.page = page;
  req.query.pageSize = pageSize;
  req.query.offset = (page - 1) * pageSize;
  
  next();
};

// 参数清理中间件（防止 SQL 注入）
const sanitizeParam = (param) => {
  if (typeof param !== 'string') {
    return param;
  }
  // 移除潜在的危险字符
  return param.replace(/[;\"']/g, '');
};

// 清理请求参数中间件
const sanitizeRequest = (req, res, next) => {
  // 清理查询参数
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeParam(req.query[key]);
      }
    }
  }
  
  // 清理 body 参数
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeParam(req.body[key]);
      }
    }
  }
  
  next();
};

module.exports = {
  validate,
  validatePagination,
  sanitizeRequest
};
