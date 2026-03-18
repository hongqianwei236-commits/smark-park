// 统一错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    timestamp: new Date().toISOString()
  });
  
  // 根据错误类型返回不同的响应
  
  // 验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: '数据验证失败',
      details: err.message
    });
  }
  
  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: '无效的认证令牌'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: '认证令牌已过期'
    });
  }
  
  // 数据库错误（模拟）
  if (err.name === 'DatabaseError') {
    return res.status(500).json({
      error: '数据库操作失败'
    });
  }
  
  // 默认错误响应
  // 在生产环境中不暴露详细的错误信息
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误',
    ...(isDevelopment && { stack: err.stack })
  });
};

// 404 处理
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: '请求的资源不存在',
    path: req.originalUrl
  });
};

// 异步错误包装器
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
