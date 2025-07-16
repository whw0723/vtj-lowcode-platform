@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 鲲鹏煎药管理控制系统 - Windows部署脚本
REM 使用方法: deploy.bat [服务器IP] [用户名]
REM 例如: deploy.bat 192.168.80.100 root

set SERVER_IP=%1
set USERNAME=%2

if "%SERVER_IP%"=="" set SERVER_IP=192.168.80.75
if "%USERNAME%"=="" set USERNAME=root

echo.
echo 🚀 鲲鹏煎药管理控制系统 - 部署脚本
echo 📋 目标服务器: %USERNAME%@%SERVER_IP%
echo.

REM 1. 检查本地环境
echo 🔍 检查本地环境...
where pnpm >nul 2>&1
if errorlevel 1 (
    echo ❌ pnpm 未安装，请先安装 pnpm
    pause
    exit /b 1
)

where ssh >nul 2>&1
if errorlevel 1 (
    echo ❌ ssh 未安装，请安装 OpenSSH 或 Git Bash
    pause
    exit /b 1
)

where scp >nul 2>&1
if errorlevel 1 (
    echo ❌ scp 未安装，请安装 OpenSSH 或 Git Bash
    pause
    exit /b 1
)

REM 2. 安装依赖
echo 📦 安装依赖...
call pnpm install --unsafe-perm --registry=https://registry.npmmirror.com
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

REM 3. 构建项目
echo 🔨 构建生产版本...
call pnpm run build:prod
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

REM 4. 检查构建结果
if not exist "dist" (
    echo ❌ 构建失败，dist目录不存在
    pause
    exit /b 1
)

echo ✅ 构建完成

REM 5. 测试服务器连接
echo 🔗 测试服务器连接...
ssh -o ConnectTimeout=10 %USERNAME%@%SERVER_IP% "echo 连接成功" >nul 2>&1
if errorlevel 1 (
    echo ❌ 无法连接到服务器 %USERNAME%@%SERVER_IP%
    echo 💡 请检查：
    echo    1. 服务器IP是否正确
    echo    2. SSH服务是否启动
    echo    3. 用户名和密钥是否正确
    pause
    exit /b 1
)

echo ✅ 服务器连接正常

REM 6. 创建临时脚本文件
echo 📝 准备部署脚本...
echo #!/bin/bash > temp_setup.sh
echo # 安装Nginx（如果未安装） >> temp_setup.sh
echo if ! command -v nginx ^&^> /dev/null; then >> temp_setup.sh
echo     echo "📦 安装Nginx..." >> temp_setup.sh
echo     if command -v apt-get ^&^> /dev/null; then >> temp_setup.sh
echo         apt-get update >> temp_setup.sh
echo         apt-get install -y nginx >> temp_setup.sh
echo     elif command -v yum ^&^> /dev/null; then >> temp_setup.sh
echo         yum install -y nginx >> temp_setup.sh
echo     fi >> temp_setup.sh
echo fi >> temp_setup.sh
echo # 创建目录 >> temp_setup.sh
echo mkdir -p /var/www/kunpeng-system >> temp_setup.sh
echo mkdir -p /var/www/kunpeng-system/backup >> temp_setup.sh
echo # 启动服务 >> temp_setup.sh
echo systemctl enable nginx >> temp_setup.sh
echo systemctl start nginx >> temp_setup.sh
echo echo "✅ 服务器环境准备完成" >> temp_setup.sh

REM 7. 上传并执行环境准备脚本
echo ⚙️ 准备服务器环境...
scp temp_setup.sh %USERNAME%@%SERVER_IP%:~/
ssh %USERNAME%@%SERVER_IP% "chmod +x temp_setup.sh && ./temp_setup.sh && rm temp_setup.sh"

REM 8. 备份现有版本
echo 📦 备份现有版本...
ssh %USERNAME%@%SERVER_IP% "if [ -f /var/www/kunpeng-system/index.html ]; then BACKUP_DIR=/var/www/kunpeng-system/backup/backup_$(date +%%Y%%m%%d_%%H%%M%%S); mkdir -p $BACKUP_DIR; cp -r /var/www/kunpeng-system/*.* $BACKUP_DIR/ 2>/dev/null || true; echo 已备份到 $BACKUP_DIR; fi"

REM 9. 上传新版本
echo 📤 上传新版本...
scp -r dist/* %USERNAME%@%SERVER_IP%:/var/www/kunpeng-system/

REM 10. 上传Nginx配置
echo 📝 配置Nginx...
scp deploy/nginx.conf %USERNAME%@%SERVER_IP%:/etc/nginx/sites-available/kunpeng-system

REM 11. 配置并重启Nginx
echo 🔄 启用站点...
ssh %USERNAME%@%SERVER_IP% "ln -sf /etc/nginx/sites-available/kunpeng-system /etc/nginx/sites-enabled/kunpeng-system && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl reload nginx"

REM 12. 设置权限
echo 🔐 设置权限...
ssh %USERNAME%@%SERVER_IP% "chown -R www-data:www-data /var/www/kunpeng-system && chmod -R 755 /var/www/kunpeng-system"

REM 13. 清理临时文件
if exist temp_setup.sh del temp_setup.sh

REM 14. 验证部署
echo 🧪 验证部署...
timeout /t 3 /nobreak >nul
curl -f -s http://%SERVER_IP%/ >nul 2>&1
if errorlevel 1 (
    echo ⚠️ 部署完成，但网站可能需要几秒钟才能访问
) else (
    echo ✅ 部署成功！
)

echo.
echo 🎉 部署完成！
echo 🌐 访问地址: http://%SERVER_IP%
echo.
echo 💡 常用维护命令:
echo    查看Nginx状态: ssh %USERNAME%@%SERVER_IP% "systemctl status nginx"
echo    重启Nginx: ssh %USERNAME%@%SERVER_IP% "systemctl restart nginx"
echo    查看错误日志: ssh %USERNAME%@%SERVER_IP% "tail -f /var/log/nginx/kunpeng-error.log"
echo.
pause
