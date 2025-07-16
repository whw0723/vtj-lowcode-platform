#!/bin/bash

# 鲲鹏煎药管理控制系统 - 一键部署脚本
# 使用方法: ./deploy.sh [服务器IP] [用户名]
# 例如: ./deploy.sh 192.168.80.100 root

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
SERVER_IP=${1:-"192.168.80.75"}
USERNAME=${2:-"root"}
PROJECT_NAME="kunpeng-system"
DEPLOY_PATH="/var/www/${PROJECT_NAME}"

echo -e "${BLUE}🚀 鲲鹏煎药管理控制系统 - 一键部署${NC}"
echo -e "${YELLOW}📋 目标服务器: ${USERNAME}@${SERVER_IP}${NC}"
echo -e "${YELLOW}📋 部署路径: ${DEPLOY_PATH}${NC}"

# 1. 检查本地环境
echo -e "${BLUE}🔍 检查本地环境...${NC}"
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm 未安装，请先安装 pnpm${NC}"
    exit 1
fi

if ! command -v ssh &> /dev/null; then
    echo -e "${RED}❌ ssh 未安装${NC}"
    exit 1
fi

if ! command -v scp &> /dev/null; then
    echo -e "${RED}❌ scp 未安装${NC}"
    exit 1
fi

# 2. 安装依赖
echo -e "${BLUE}📦 安装依赖...${NC}"
pnpm install --unsafe-perm --registry=https://registry.npmmirror.com

# 3. 构建项目
echo -e "${BLUE}🔨 构建生产版本...${NC}"
pnpm run build:prod

# 4. 检查构建结果
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ 构建失败，dist目录不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 构建完成${NC}"

# 5. 测试服务器连接
echo -e "${BLUE}🔗 测试服务器连接...${NC}"
if ! ssh -o ConnectTimeout=10 ${USERNAME}@${SERVER_IP} "echo '连接成功'" > /dev/null 2>&1; then
    echo -e "${RED}❌ 无法连接到服务器 ${USERNAME}@${SERVER_IP}${NC}"
    echo -e "${YELLOW}💡 请检查：${NC}"
    echo -e "   1. 服务器IP是否正确"
    echo -e "   2. SSH服务是否启动"
    echo -e "   3. 用户名和密钥是否正确"
    exit 1
fi

echo -e "${GREEN}✅ 服务器连接正常${NC}"

# 6. 在服务器上准备环境
echo -e "${BLUE}⚙️ 准备服务器环境...${NC}"
ssh ${USERNAME}@${SERVER_IP} << 'EOF'
# 安装Nginx（如果未安装）
if ! command -v nginx &> /dev/null; then
    echo "📦 安装Nginx..."
    if command -v apt-get &> /dev/null; then
        apt-get update
        apt-get install -y nginx
    elif command -v yum &> /dev/null; then
        yum install -y nginx
    else
        echo "❌ 无法自动安装Nginx，请手动安装"
        exit 1
    fi
fi

# 创建部署目录
mkdir -p /var/www/kunpeng-system
mkdir -p /var/www/kunpeng-system/backup

# 启动Nginx服务
systemctl enable nginx
systemctl start nginx

echo "✅ 服务器环境准备完成"
EOF

# 7. 备份现有版本
echo -e "${BLUE}📦 备份现有版本...${NC}"
ssh ${USERNAME}@${SERVER_IP} << EOF
if [ -d "${DEPLOY_PATH}/index.html" ]; then
    BACKUP_DIR="${DEPLOY_PATH}/backup/backup_\$(date +%Y%m%d_%H%M%S)"
    mkdir -p \$BACKUP_DIR
    cp -r ${DEPLOY_PATH}/*.* \$BACKUP_DIR/ 2>/dev/null || true
    echo "✅ 已备份到 \$BACKUP_DIR"
fi
EOF

# 8. 上传新版本
echo -e "${BLUE}📤 上传新版本...${NC}"
scp -r dist/* ${USERNAME}@${SERVER_IP}:${DEPLOY_PATH}/

# 9. 上传Nginx配置
echo -e "${BLUE}📝 配置Nginx...${NC}"
scp deploy/nginx.conf ${USERNAME}@${SERVER_IP}:/etc/nginx/sites-available/${PROJECT_NAME}

# 10. 启用站点并重启Nginx
echo -e "${BLUE}🔄 启用站点...${NC}"
ssh ${USERNAME}@${SERVER_IP} << EOF
# 启用站点
ln -sf /etc/nginx/sites-available/${PROJECT_NAME} /etc/nginx/sites-enabled/${PROJECT_NAME}

# 删除默认站点（可选）
rm -f /etc/nginx/sites-enabled/default

# 测试Nginx配置
nginx -t

# 重新加载Nginx
systemctl reload nginx

echo "✅ Nginx配置完成"
EOF

# 11. 设置权限
echo -e "${BLUE}🔐 设置权限...${NC}"
ssh ${USERNAME}@${SERVER_IP} << EOF
chown -R www-data:www-data ${DEPLOY_PATH}
chmod -R 755 ${DEPLOY_PATH}
echo "✅ 权限设置完成"
EOF

# 12. 验证部署
echo -e "${BLUE}🧪 验证部署...${NC}"
sleep 3
if curl -f -s http://${SERVER_IP}/ > /dev/null; then
    echo -e "${GREEN}✅ 部署成功！${NC}"
    echo -e "${GREEN}🌐 访问地址: http://${SERVER_IP}${NC}"
else
    echo -e "${YELLOW}⚠️ 部署完成，但网站可能需要几秒钟才能访问${NC}"
    echo -e "${BLUE}🌐 访问地址: http://${SERVER_IP}${NC}"
fi

# 13. 显示部署信息
echo -e "${BLUE}📋 部署信息:${NC}"
echo -e "${YELLOW}项目名称: 鲲鹏煎药管理控制系统${NC}"
echo -e "${YELLOW}部署路径: ${DEPLOY_PATH}${NC}"
echo -e "${YELLOW}Nginx配置: /etc/nginx/sites-available/${PROJECT_NAME}${NC}"
echo -e "${YELLOW}访问地址: http://${SERVER_IP}${NC}"
echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"

# 14. 显示常用命令
echo -e "${BLUE}💡 常用维护命令:${NC}"
echo -e "${YELLOW}查看Nginx状态: systemctl status nginx${NC}"
echo -e "${YELLOW}重启Nginx: systemctl restart nginx${NC}"
echo -e "${YELLOW}查看错误日志: tail -f /var/log/nginx/kunpeng-error.log${NC}"
echo -e "${YELLOW}查看访问日志: tail -f /var/log/nginx/kunpeng-access.log${NC}"
