#!/bin/bash

# 鲲鹏煎药管理控制系统 - 快速部署脚本（适合熟悉Linux的用户）
# 使用方法: ./quick-deploy.sh 服务器IP

SERVER_IP=$1

if [ -z "$SERVER_IP" ]; then
    echo "❌ 请提供服务器IP地址"
    echo "使用方法: ./quick-deploy.sh 192.168.80.100"
    exit 1
fi

echo "🚀 开始快速部署到 $SERVER_IP"

# 1. 构建
echo "🔨 构建项目..."
pnpm run build:prod

# 2. 上传
echo "📤 上传文件..."
scp -r dist/* root@$SERVER_IP:/var/www/kunpeng-system/
scp deploy/nginx.conf root@$SERVER_IP:/etc/nginx/sites-available/kunpeng-system

# 3. 配置
echo "⚙️ 配置服务器..."
ssh root@$SERVER_IP << 'EOF'
ln -sf /etc/nginx/sites-available/kunpeng-system /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
chown -R www-data:www-data /var/www/kunpeng-system
chmod -R 755 /var/www/kunpeng-system
EOF

echo "✅ 部署完成！访问地址: http://$SERVER_IP"
