# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

手账素材小程序（Journaling Materials Hub）— 微信小程序，提供手账素材浏览、下载，支持兑换码激活会员。

**当前状态**：渐进式迁移中（详见 `plan.md`），新旧两套技术栈并行运行，共享同一 MySQL 数据库。

## 技术栈

| 层级 | 旧栈（迁移中） | 新栈（目标） |
|------|----------------|--------------|
| 前端 | 原生微信小程序 `miniprogram/` | uni-app Vue 3 `frontend/` |
| 后端 | Node.js Express `server/` | Spring Boot 3 `backend/` |
| ORM | Sequelize | MyBatis-Plus 3.5.5 |
| 认证 | JWT (jsonwebtoken) | JWT (jjwt 0.12.5) |

**共享基础设施**：MySQL 8.0、Redis 7、Nginx 反向代理、Docker Compose

**Nginx 路由规则**：`/api/` → Node.js (3000)，`/api/v2/` → Spring Boot (8080)

## 常用命令

### Node.js 后端 (`server/`)
```bash
cd server
npm run dev            # nodemon 开发模式
npm start              # 生产模式
npm run migrate        # 数据库迁移
npm run seed           # 填充种子数据
npm test               # Jest 测试
```

### Spring Boot 后端 (`backend/`)
```bash
cd backend
mvn spring-boot:run    # 开发模式 (port 8080)
mvn clean package -DskipTests  # 构建 JAR
mvn test               # 运行测试
```

### uni-app 前端 (`frontend/`)
```bash
cd frontend
npm run dev:mp-weixin  # 微信小程序开发构建
npm run build:mp-weixin # 微信小程序生产构建
npm run dev:h5         # H5 开发构建
npm run build:h5       # H5 生产构建
```

### Docker
```bash
docker-compose up -d           # 启动所有服务
docker-compose logs -f         # 查看日志
docker-compose stop backend    # 停止单个服务
```

## 架构

### 后端分层（Spring Boot）
```
com.journaling.hub/
  controller/   → REST 端点，返回 Result<T> 统一响应
  service/      → 业务逻辑（接口 + impl/ 实现）
  mapper/       → MyBatis-Plus Mapper 接口
  entity/       → 数据库实体（@TableName 注解）
  dto/          → 请求/响应 DTO
  common/       → Result, PageResult, ErrorCode, BusinessException
  config/       → CORS, Redis, Swagger, MyBatis-Plus 配置
  filter/       → JwtAuthenticationFilter（拦截 /api/v2/**）
  util/         → JwtUtil, WeChatUtil
```

### 前端结构（uni-app Vue 3）
```
frontend/src/
  api/          → request.js (封装 uni.request + JWT), 各模块 API
  stores/       → Pinia 状态管理 (user.js, material.js)
  pages/        → index, detail, tools, profile
  components/   → MaterialCard, RedeemModal, LoadingSpinner, EmptyState
```

### 数据库（4 张表）
`users`、`materials`、`redeem_codes`、`downloads` — 新旧后端共用同一套表结构

### API 端点
完整文档见 `docs/api.md`。主要模块：
- 用户：微信登录、个人信息
- 素材：列表（分页）、详情、搜索
- 兑换码：验证、激活
- 下载：记录、历史

### 认证模式
- `REQUIRED` — 必须登录
- `OPTIONAL` — 可选登录（返回不同数据）
- `PREMIUM` — 需要会员权限

## 迁移计划

5 阶段渐进式迁移，详见 `plan.md`：
- **Phase 0** ✅ 脚手架搭建（已完成）
- **Phase 1** 核心功能开发（用户、素材、兑换码、下载）
- **Phase 2** 功能完善（搜索、收藏、统计）
- **Phase 3** 测试与部署
- **Phase 4** 旧代码清理

## 环境变量

复制 `.env.example` 为 `.env`，配置：
- `MYSQL_ROOT_PASSWORD` — MySQL root 密码
- `JWT_SECRET` — JWT 签名密钥（≥32 字符）
- `WECHAT_APP_ID` / `WECHAT_APP_SECRET` — 微信小程序凭证

## 开发流程

### 按 Phase 推进（阶段式开发）
- 严格按照 `docs/frontend-ui-dev-plan.md` 或 `plan.md` 定义的 Phase 顺序开发
- **禁止跨阶段开发** — 完成一个 Phase 并验证通过后，再进入下一 Phase

### 前后端并行开发
- 每个 Phase 中，前端和后端的工作**同步进行**，不串行等待
- 前端 `frontend/`（uni-app Vue 3）和后端 `backend/`（Spring Boot）的工作互不阻塞
- 使用共享 API 文档 `docs/api.md` 对齐接口契约

### 完成即测试
- 每个 Phase 完成后，立即进行端到端验证：
  - **前端**：`npm run dev:mp-weixin` 构建 → 微信开发者工具预览
  - **后端**：`mvn test` 运行单元测试 + API 手动测试
  - **联调**：前后端对接验证核心流程
- 确认无误后标记 Phase 完成，再进入下一 Phase

## 项目文档

| 文件 | 内容 |
|------|------|
| `docs/api.md` | API 接口文档（13 个端点） |
| `docs/database.md` | 数据库 Schema 与 ER 图 |
| `docs/deployment.md` | 部署指南（Nginx、SSL、域名备案） |
| `plan.md` | 迁移计划与回滚方案 |
| `PROJECT_SUMMARY.md` | 项目总览 |
