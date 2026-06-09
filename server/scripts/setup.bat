@echo off
chcp 65001 >nul

echo ===================================
echo 手账素材小程序 - 环境配置脚本
echo ===================================

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到 Node.js，请先安装 Node.js 16+
    pause
    exit /b 1
)

echo Node.js 版本:
node -v

REM 安装依赖
echo.
echo 正在安装依赖...
call npm install

if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

echo 依赖安装完成

REM 检查 .env 文件
if not exist .env (
    echo.
    echo 正在创建 .env 文件...
    copy .env.example .env
    echo 已创建 .env 文件，请编辑配置数据库和微信小程序信息
    echo 配置文件位置: %cd%\.env
) else (
    echo .env 文件已存在
)

REM 提示用户配置
echo.
echo ===================================
echo 请完成以下配置：
echo ===================================
echo 1. 编辑 .env 文件，配置数据库连接信息
echo 2. 编辑 .env 文件，配置微信小程序 AppID 和 Secret
echo 3. 创建数据库: CREATE DATABASE journaling_materials_hub;
echo 4. 运行数据库迁移: npm run migrate
echo 5. 插入种子数据（可选）: npm run seed
echo 6. 启动服务: npm run dev
echo.
echo ===================================
echo 配置完成后，运行以下命令启动服务：
echo ===================================
echo cd %cd%
echo npm run dev
echo.
echo 服务将在 http://localhost:3000 启动
echo ===================================

pause
