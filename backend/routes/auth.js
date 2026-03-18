const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { validate } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

// 从环境变量获取 JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET || 'park-saas-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// 登录验证规则
const loginValidationRules = {
  username: { required: true, type: 'string', minLength: 1, maxLength: 50, label: '用户名' },
  password: { required: true, type: 'string', minLength: 1, label: '密码' }
};

// 登录
router.post('/login', validate(loginValidationRules), asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
}));

// 登出
router.post('/logout', asyncHandler(async (req, res) => {
  // 在实际应用中，这里可以将 token 加入黑名单
  // 由于 JWT 是无状态的，客户端删除 token 即可
  res.json({ message: '登出成功' });
}));

// 获取当前用户
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const user = db.prepare('SELECT id, username, role, created_at FROM users WHERE id = ?').get(req.userId);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  res.json(user);
}));

// 验证Token中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: '令牌已过期，请重新登录' });
      }
      return res.status(403).json({ error: '令牌无效' });
    }
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  });
}

// 角色验证中间件
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ error: '权限不足' });
    }
    next();
  };
}

module.exports = { router, authenticateToken, requireRole };
