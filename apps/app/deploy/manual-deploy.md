# 鲲鹏煎药管理控制系统 - 手动部署指南

## 📋 部署前准备

### 1. 服务器要求
- **操作系统**: Ubuntu 18.04+ / CentOS 7+ / Debian 9+
- **内存**: 最低1GB，推荐2GB+
- **硬盘**: 最低10GB可用空间
- **网络**: 能访问192.168.80.75:8000（后端API服务器）

### 2. 软件要求
- **Nginx**: 1.14+
- **SSH访问权限**
- **sudo权限**（用于安装软件和配置）

## 🚀 部署步骤

### 第一步：在本地构建项目

```bash
# 1. 进入项目目录
cd apps/app

# 2. 安装依赖
pnpm install --unsafe-perm --registry=https://registry.npmmirror.com

# 3. 构建生产版本
pnpm run build:prod

# 4. 检查构建结果
ls -la dist/
```

### 第二步：准备服务器环境

```bash
# 连接到服务器
ssh root@你的服务器IP

# 安装Nginx（Ubuntu/Debian）
sudo apt update
sudo apt install nginx -y

# 安装Nginx（CentOS/RHEL）
sudo yum install nginx -y
# 或者（CentOS 8+）
sudo dnf install nginx -y

# 启动并启用Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 创建项目目录
sudo mkdir -p /var/www/kunpeng-system
sudo mkdir -p /var/www/kunpeng-system/backup
```

### 第三步：上传文件

```bash
# 在本地执行，上传构建文件
scp -r dist/* root@你的服务器IP:/var/www/kunpeng-system/

# 上传Nginx配置文件
scp deploy/nginx.conf root@你的服务器IP:/etc/nginx/sites-available/kunpeng-system
```

### 第四步：配置Nginx

```bash
# 在服务器上执行

# 启用站点
sudo ln -s /etc/nginx/sites-available/kunpeng-system /etc/nginx/sites-enabled/

# 禁用默认站点（可选）
sudo rm -f /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重新加载配置
sudo systemctl reload nginx
```

### 第五步：设置权限

```bash
# 设置文件权限
sudo chown -R www-data:www-data /var/www/kunpeng-system
sudo chmod -R 755 /var/www/kunpeng-system
```

### 第六步：验证部署

```bash
# 检查Nginx状态
sudo systemctl status nginx

# 测试网站访问
curl http://你的服务器IP

# 查看日志
sudo tail -f /var/log/nginx/kunpeng-error.log
```

## 🔧 配置说明

### Nginx配置要点

1. **静态文件路径**: `/var/www/kunpeng-system`
2. **API代理**: `/Manage` → `http://192.168.80.75:8000`
3. **前端路由**: 支持Vue Router的History模式
4. **缓存策略**: 静态资源长期缓存，页面不缓存

### 重要配置项

```nginx
# 根目录
root /var/www/kunpeng-system;

# API代理
location /Manage {
    proxy_pass http://192.168.80.75:8000;
    # ... 其他代理配置
}

# 前端路由支持
location / {
    try_files $uri $uri/ /index.html;
}
```

## 🛠️ 常见问题解决

### 1. 网站无法访问
```bash
# 检查Nginx状态
sudo systemctl status nginx

# 检查端口占用
sudo netstat -tlnp | grep :80

# 检查防火墙
sudo ufw status
sudo firewall-cmd --list-all
```

### 2. API请求失败
```bash
# 检查后端服务器连通性
curl http://192.168.80.75:8000/Manage/test

# 查看Nginx错误日志
sudo tail -f /var/log/nginx/kunpeng-error.log
```

### 3. 页面刷新404
- 确保Nginx配置中有 `try_files $uri $uri/ /index.html;`
- 检查文件权限是否正确

## 📊 监控和维护

### 日志文件位置
- **访问日志**: `/var/log/nginx/kunpeng-access.log`
- **错误日志**: `/var/log/nginx/kunpeng-error.log`

### 常用命令
```bash
# 重启Nginx
sudo systemctl restart nginx

# 重新加载配置
sudo systemctl reload nginx

# 查看实时日志
sudo tail -f /var/log/nginx/kunpeng-access.log

# 检查配置语法
sudo nginx -t
```

## 🔄 更新部署

### 快速更新流程
```bash
# 1. 本地构建新版本
pnpm run build:prod

# 2. 备份现有版本
ssh root@服务器IP "cp -r /var/www/kunpeng-system /var/www/kunpeng-system.backup.$(date +%Y%m%d_%H%M%S)"

# 3. 上传新版本
scp -r dist/* root@服务器IP:/var/www/kunpeng-system/

# 4. 清除浏览器缓存或强制刷新
```

## 🎯 性能优化建议

1. **启用Gzip压缩**（已在配置中包含）
2. **设置合适的缓存策略**（已配置）
3. **使用CDN**（可选）
4. **定期清理日志文件**
5. **监控服务器资源使用情况**

---

**部署完成后，你的鲲鹏煎药管理控制系统就可以通过 `http://你的服务器IP` 访问了！** 🎉
