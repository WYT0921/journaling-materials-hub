# 手账素材小程序 - 项目总结

## 项目概述

本项目是一个手账素材管理微信小程序，采用Uber极简功能型设计风格，提供素材浏览、会员系统、兑换码激活等功能。

## 技术架构

### 前端（微信小程序）
- **框架**: 微信小程序原生开发
- **语言**: WXML + WXSS + JavaScript
- **状态管理**: app.globalData + 本地缓存
- **图片处理**: 微信原生API

### 后端（Node.js）
- **运行环境**: Node.js 16+
- **框架**: Express.js
- **数据库**: MySQL 8.0 + Sequelize ORM
- **认证**: JWT (JSON Web Token)
- **文件存储**: 七牛云/腾讯云COS

### 部署方案
- **传统部署**: Linux服务器 + Nginx + PM2
- **容器化部署**: Docker + Docker Compose

## 项目结构

```
journaling-materials-hub/
├── miniprogram/                    # 微信小程序前端
│   ├── pages/
│   │   ├── index/                  # 首页 - 素材流
│   │   ├── detail/                 # 素材详情页
│   │   ├── tools/                  # 工具页
│   │   └── profile/                # 我的页面
│   ├── utils/                      # 工具函数
│   ├── assets/                     # 资源文件
│   ├── app.js                      # 应用入口
│   ├── app.json                    # 应用配置
│   └── app.wxss                    # 全局样式
├── server/                         # 后端服务
│   ├── src/
│   │   ├── controllers/            # 控制器
│   │   ├── models/                 # 数据模型
│   │   ├── routes/                 # 路由
│   │   ├── middleware/             # 中间件
│   │   └── utils/                  # 工具函数
│   ├── config/                     # 配置文件
│   ├── migrations/                 # 数据库迁移
│   ├── seeders/                    # 种子数据
│   ├── scripts/                    # 脚本文件
│   ├── package.json                # 依赖配置
│   ├── Dockerfile                  # Docker配置
│   └── .env.example                # 环境变量示例
├── nginx/                          # Nginx配置
├── docs/                           # 项目文档
├── docker-compose.yml              # Docker编排
├── .env.example                    # 环境变量示例
├── .gitignore                      # Git忽略文件
├── LICENSE                         # 开源协议
└── README.md                       # 项目说明
```

## 已完成的功能模块

### 1. 小程序前端
- [x] 应用入口和全局配置
- [x] 首页（素材流、搜索、筛选）
- [x] 素材详情页（大图展示、会员权限）
- [x] 工具页（工具分类、FAB按钮）
- [x] 我的页面（用户信息、会员中心）
- [x] API请求封装
- [x] 认证工具函数
- [x] 本地存储工具

### 2. 后端服务
- [x] Express应用框架
- [x] 用户认证（JWT）
- [x] 数据库模型（User, Material, RedeemCode, Download）
- [x] 控制器（用户、素材、兑换码、下载）
- [x] 路由定义
- [x] 中间件（认证、错误处理、404处理）
- [x] 数据库迁移脚本
- [x] 种子数据

### 3. 部署配置
- [x] Docker配置（Dockerfile, docker-compose.yml）
- [x] Nginx配置
- [x] 环境变量配置
- [x] 启动脚本（Linux/Windows）

### 4. 项目文档
- [x] README.md（项目说明）
- [x] API文档（docs/api.md）
- [x] 数据库设计文档（docs/database.md）
- [x] 部署指南（docs/deployment.md）

## 核心功能

### 1. 素材浏览
- 瀑布流布局展示素材
- 支持搜索和分类筛选
- 无限滚动加载
- 图片懒加载优化

### 2. 会员系统
- 会员权限控制
- 兑换码激活会员
- 会员到期时间管理
- 非会员模糊图片处理

### 3. 下载功能
- 素材下载记录
- 下载次数统计
- 会员下载权限控制

### 4. 用户管理
- 微信登录
- 用户信息管理
- 会员状态管理

## 快速开始

### 方式一：传统部署

```bash
# 1. 克隆项目
git clone <repository-url>
cd journaling-materials-hub

# 2. 后端设置
cd server
npm install
cp .env.example .env
# 编辑 .env 文件配置数据库和微信信息
npm run migrate
npm run dev

# 3. 前端设置
# 使用微信开发者工具导入 miniprogram 目录
# 修改 utils/api.js 中的 baseUrl
```

### 方式二：Docker部署

```bash
# 1. 克隆项目
git clone <repository-url>
cd journaling-materials-hub

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 3. 启动服务
docker-compose up -d

# 4. 查看日志
docker-compose logs -f
```

## 配置说明

### 微信小程序配置

1. 登录[微信公众平台](https://mp.weixin.qq.com/)
2. 获取AppID和AppSecret
3. 配置服务器域名
4. 修改 `miniprogram/utils/api.js` 中的 `baseUrl`

### 数据库配置

```sql
CREATE DATABASE journaling_materials_hub 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### 环境变量配置

```bash
# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=journaling_materials_hub

# JWT配置
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# 微信配置
WECHAT_APPID=your_appid
WECHAT_SECRET=your_secret
```

## 设计规范

### 颜色系统
- 主背景：`#FFFFFF`
- 次背景：`#F7F7F7`
- 主文字：`#111111`
- 次文字：`#777777`
- 边框：`#EEEEEE`
- 强调色：`#111111`
- 错误色：`#FF4D4F`

### 字体规范
- 字体：PingFang SC / SF Pro
- 标题：18-20px
- 正文：16px
- 辅助文字：14px

### 间距规范
- 基础单位：8px
- 常用间距：8px, 16px, 24px, 32px

### 圆角规范
- 小圆角：8px
- 中圆角：12px
- 全圆角：100px

## API接口

### 用户接口
- `POST /api/user/login` - 用户登录
- `GET /api/user/profile` - 获取用户信息
- `GET /api/user/premium-status` - 获取会员状态

### 素材接口
- `GET /api/materials` - 获取素材列表
- `GET /api/materials/:id` - 获取素材详情
- `GET /api/materials/search` - 搜索素材

### 兑换码接口
- `POST /api/redeem/verify` - 验证兑换码
- `POST /api/redeem/activate` - 激活会员

### 下载接口
- `GET /api/download/:materialId` - 下载素材
- `GET /api/download/records` - 下载记录

## 开发计划

### 第一阶段：基础架构搭建（1周）✅
- [x] 初始化项目结构
- [x] 搭建后端服务框架
- [x] 设计数据库并创建表
- [x] 实现基础API接口

### 第二阶段：核心功能开发（2周）
- [ ] 实现首页素材流
- [ ] 实现素材详情页
- [ ] 实现工具页
- [ ] 实现我的页面基础功能

### 第三阶段：会员系统开发（1周）
- [ ] 实现兑换码验证逻辑
- [ ] 实现会员激活流程
- [ ] 实现权限控制中间件
- [ ] 实现模糊图片处理

### 第四阶段：优化与测试（1周）
- [ ] 性能优化
- [ ] UI/UX细节打磨
- [ ] 单元测试和集成测试
- [ ] 真机测试

### 第五阶段：部署上线（3天）
- [ ] 服务器环境配置
- [ ] 域名备案和HTTPS配置
- [ ] 小程序审核提交
- [ ] 上线发布

## 注意事项

### 1. 微信小程序要求
- 必须使用HTTPS
- 域名需要备案
- 服务器域名需要在微信公众平台配置

### 2. 数据库要求
- 使用MySQL 8.0+
- 字符集：utf8mb4
- 排序规则：utf8mb4_unicode_ci

### 3. 安全建议
- 使用强密码
- 定期更新依赖
- 限制API访问频率
- 记录访问日志
- 定期备份数据

### 4. 性能优化
- 使用CDN加速图片加载
- 启用Gzip压缩
- 使用Redis缓存热点数据
- 优化数据库查询

## 常见问题

### 1. 小程序无法连接后端
- 检查域名是否已备案
- 确保配置了SSL证书
- 在微信公众平台配置服务器域名
- 检查防火墙设置

### 2. 数据库连接失败
- 检查数据库配置信息
- 确保MySQL服务已启动
- 检查用户权限

### 3. 图片加载失败
- 检查图片URL是否正确
- 确保图片服务器支持HTTPS
- 检查CORS配置

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件至：your-email@example.com

## 致谢

- 设计风格参考：Uber极简功能型设计
- 图标来源：自定义线性图标库
- 字体：PingFang SC / SF Pro
