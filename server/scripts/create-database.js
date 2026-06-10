// scripts/create-database.js
// 创建数据库脚本

require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  });

  try {
    const dbName = process.env.DB_NAME || 'journaling_materials_hub';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`数据库 "${dbName}" 创建成功或已存在`);
  } catch (error) {
    console.error('创建数据库失败:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createDatabase();
