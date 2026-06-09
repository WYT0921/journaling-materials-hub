# 手账素材小程序

一个手账素材管理微信小程序，采用Uber极简功能型设计风格。

## 功能特性

### 首页 - 素材流
- 瀑布流布局展示素材
- 支持搜索素材、风格、标签
- 分类筛选：治愈系、极简风、胶带、PNG
- 无限滚动加载

### 素材详情页
- 大图展示
- 会员权限控制（非会员模糊处理）
- 下载功能

### 工具页
- 排版工具、配色工具、字体资源等
- FAB悬浮按钮
- 复制链接功能

### 我的页面
- 用户信息展示
- 会员状态显示
- 兑换码激活会员
- 下载记录、收藏

## 技术栈

### 前端
- 微信小程序原生开发
- WXML + WXSS + JavaScript
- 自定义组件

### 后端
- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT认证
- Redis缓存（可选）

### 部署
- 阿里云ECS / 腾讯云服务器
- 域名备案 + HTTPS
- 对象存储（七牛云/腾讯云COS）

## 项目结构

```
journaling-materials-hub/
├── miniprogram/                    # 微信小程序前端
│   ├── pages/
│   │   ├── index/                  # 首页
│   │   ├── detail/                 # 详情页
│   │   ├── tools/                  # 工具页
│   │   └── profile/                # 我的页面
│   ├── components/                 # 自定义组件
│   ├── utils/                      # 工具函数
│   ├── styles/                     # 样式文件
│   ├── app.js
│   ├── app.json
│   └── app.wxss
├── server/                         # 后端服务
│   ├── src/
│   │   ├── controllers/            # 控制器
│   │   ├── models/                 # 数据模型
│   │   ├── routes/                 # 路由
│   │   ├── middleware/             # 中间件
│   │   ├── services/               # 业务逻辑
│   │   └── utils/                  # 工具函数
│   ├── config/                     # 配置文件
│   ├── migrations/                 # 数据库迁移
│   ├── seeders/                    # 种子数据
│   └── package.json
└── docs/                           # 文档
```

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd journaling-materials-hub
```

### 2. 后端设置

```bash
cd server

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库、微信等信息

# 运行数据库迁移
npm run migrate

# 插入种子数据（可选）
npm run seed

# 启动开发服务器
npm run dev
```

### 3. 前端设置

1. 下载并安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开微信开发者工具，导入 `miniprogram` 目录
3. 配置项目信息（AppID等）
4. 修改 `utils/api.js` 中的 `baseUrl` 为后端服务地址

### 4. 数据库设置

```sql
-- 创建数据库
CREATE DATABASE journaling_materials_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户（可选）
CREATE USER 'journaling_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON journaling_materials_hub.* TO 'journaling_user'@'localhost';
FLUSH PRIVILEGES;
```

## 设计规范

### 颜色Token
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

## API接口

### 用户相关
- `POST /api/user/login` - 用户登录
- `GET /api/user/profile` - 获取用户信息
- `GET /api/user/premium-status` - 获取会员状态

### 素材相关
- `GET /api/materials` - 获取素材列表
- `GET /api/materials/:id` - 获取素材详情
- `GET /api/materials/search` - 搜索素材

### 兑换码相关
- `POST /api/redeem/verify` - 验证兑换码
- `POST /api/redeem/activate` - 激活会员

### 下载相关
- `GET /api/download/:materialId` - 下载素材
- `GET /api/download/records` - 下载记录

## 部署说明

### 后端部署

1. **服务器准备**
   - 购买阿里云ECS或腾讯云服务器
   - 安装Node.js 16+
   - 安装MySQL 8.0+
   - 安装Nginx（可选，用于反向代理）

2. **域名配置**
   - 购买域名并完成备案
   - 配置SSL证书（小程序要求HTTPS）

3. **部署步骤**

```bash
# 上传代码到服务器
scp -r server/ user@your-server:/path/to/journaling-materials-hub/

# SSH登录服务器
ssh user@your-server

# 进入项目目录
cd /path/to/journaling-materials-hub/server

# 安装依赖
npm install --production

# 配置环境变量
cp .env.example .env
vim .env

# 运行数据库迁移
npm run migrate

# 使用PM2启动服务
npm install -g pm2
pm2 start src/app.js --name journaling-materials-hub

# 设置开机自启
pm2 startup
pm2 save
```

4. **Nginx配置（可选）**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 前端部署

1. 在微信开发者工具中上传代码
2. 登录[微信公众平台](https://mp.weixin.qq.com/)提交审核
3. 审核通过后发布

## 常见问题

### 1. 小程序无法连接后端
- 检查 `baseUrl` 配置是否正确
- 确保后端服务已启动
- 检查域名是否已备案并配置HTTPS
- 在微信公众平台配置服务器域名

### 2. 数据库连接失败
- 检查数据库配置信息
- 确保MySQL服务已启动
- 检查用户权限

### 3. 图片加载失败
- 检查图片URL是否正确
- 确保图片服务器支持HTTPS
- 检查CDN配置

## 开发计划

### 第一阶段：基础架构搭建（1周）
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
