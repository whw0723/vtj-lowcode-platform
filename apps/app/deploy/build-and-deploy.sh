#!/bin/bash

# 鲲鹏煎药管理控制系统 - 构建和部署脚本
# 使用方法: ./build-and-deploy.sh [环境] [服务器IP]
# 例如: ./build-and-deploy.sh prod 192.168.80.100

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
ENV=${1:-prod}
SERVER_IP=${2:-"192.168.80.75"}
PROJECT_NAME="kunpeng-system"
DEPLOY_PATH="/var/www/${PROJECT_NAME}"
NGINX_CONFIG_PATH="/etc/nginx/sites-available/${PROJECT_NAME}"
NGINX_ENABLED_PATH="/etc/nginx/sites-enabled/${PROJECT_NAME}"

echo -e "${BLUE}🚀 开始构建和部署鲲鹏煎药管理控制系统${NC}"
echo -e "${YELLOW}📋 环境: ${ENV}${NC}"
echo -e "${YELLOW}📋 服务器: ${SERVER_IP}${NC}"

# 1. 检查依赖
echo -e "${BLUE}📦 检查依赖...${NC}"
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm 未安装，请先安装 pnpm${NC}"
    exit 1
fi

# 2. 安装依赖
echo -e "${BLUE}📦 安装依赖...${NC}"
pnpm install --unsafe-perm --registry=https://registry.npmmirror.com

# 3. 构建项目
echo -e "${BLUE}🔨 构建项目 (${ENV})...${NC}"
case $ENV in
    "dev")
        pnpm run build:dev
        ;;
    "sit")
        pnpm run build:sit
        ;;
    "uat")
        pnpm run build:uat
        ;;
    "pre")
        pnpm run build:pre
        ;;
    "prod")
        pnpm run build:prod
        ;;
    *)
        echo -e "${RED}❌ 未知环境: ${ENV}${NC}"
        echo -e "${YELLOW}💡 支持的环境: dev, sit, uat, pre, prod${NC}"
        exit 1
        ;;
esac

# 4. 检查构建结果
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ 构建失败，dist目录不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 构建完成${NC}"

# 5. 创建部署包
echo -e "${BLUE}📦 创建部署包...${NC}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOY_PACKAGE="${PROJECT_NAME}_${ENV}_${TIMESTAMP}.tar.gz"

tar -czf "${DEPLOY_PACKAGE}" -C dist .
echo -e "${GREEN}✅ 部署包创建完成: ${DEPLOY_PACKAGE}${NC}"

# 6. 生成部署脚本
echo -e "${BLUE}📝 生成服务器部署脚本...${NC}"
cat > deploy-server.sh << EOF
#!/bin/bash

# 服务器端部署脚本
set -e

echo "🚀 开始部署鲲鹏煎药管理控制系统..."

# 创建部署目录
sudo mkdir -p ${DEPLOY_PATH}
sudo mkdir -p ${DEPLOY_PATH}/backup

# 备份现有版本
if [ -d "${DEPLOY_PATH}/dist" ]; then
    echo "📦 备份现有版本..."
    sudo mv ${DEPLOY_PATH}/dist ${DEPLOY_PATH}/backup/dist_\$(date +%Y%m%d_%H%M%S)
fi

# 解压新版本
echo "📦 解压新版本..."
sudo mkdir -p ${DEPLOY_PATH}/dist
sudo tar -xzf ${DEPLOY_PACKAGE} -C ${DEPLOY_PATH}/dist

# 设置权限
sudo chown -R www-data:www-data ${DEPLOY_PATH}
sudo chmod -R 755 ${DEPLOY_PATH}

# 配置Nginx
echo "⚙️ 配置Nginx..."
sudo cp nginx.conf ${NGINX_CONFIG_PATH}

# 启用站点
if [ ! -L "${NGINX_ENABLED_PATH}" ]; then
    sudo ln -s ${NGINX_CONFIG_PATH} ${NGINX_ENABLED_PATH}
fi

# 测试Nginx配置
sudo nginx -t

# 重新加载Nginx
sudo systemctl reload nginx

echo "✅ 部署完成！"
echo "🌐 访问地址: http://${SERVER_IP}"
EOF

chmod +x deploy-server.sh

echo -e "${GREEN}✅ 部署脚本生成完成${NC}"

# 7. 显示部署说明
echo -e "${BLUE}📋 部署说明:${NC}"
echo -e "${YELLOW}1. 将以下文件上传到服务器:${NC}"
echo -e "   - ${DEPLOY_PACKAGE}"
echo -e "   - deploy-server.sh"
echo -e "   - deploy/nginx.conf"
echo ""
echo -e "${YELLOW}2. 在服务器上执行:${NC}"
echo -e "   chmod +x deploy-server.sh"
echo -e "   sudo ./deploy-server.sh"
echo ""
echo -e "${YELLOW}3. 或者使用以下命令直接部署到服务器:${NC}"
echo -e "   scp ${DEPLOY_PACKAGE} deploy-server.sh deploy/nginx.conf user@${SERVER_IP}:~/"
echo -e "   ssh user@${SERVER_IP} 'sudo ./deploy-server.sh'"

echo -e "${GREEN}🎉 构建和部署准备完成！${NC}"
