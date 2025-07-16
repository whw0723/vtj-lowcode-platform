# 🚀 鲲鹏煎药管理控制系统 - 部署指南

## 📋 部署文件说明

| 文件名 | 说明 | 适用场景 |
|--------|------|----------|
| `deploy.bat` | Windows一键部署脚本 | Windows开发环境 |
| `deploy.sh` | Linux一键部署脚本 | Linux/Mac开发环境 |
| `quick-deploy.sh` | 快速部署脚本 | 熟悉Linux的用户 |
| `nginx.conf` | Nginx配置文件 | 所有部署方式 |
| `manual-deploy.md` | 手动部署详细指南 | 需要了解详细步骤 |

## 🎯 推荐部署方式

### 方式一：一键部署（推荐）

**Windows用户：**
```cmd
# 在 apps/app 目录下执行
deploy\deploy.bat 192.168.80.100 root
```

**Linux/Mac用户：**
```bash
# 在 apps/app 目录下执行
./deploy/deploy.sh 192.168.80.100 root
```

### 方式二：快速部署（适合熟悉Linux的用户）

```bash
./deploy/quick-deploy.sh 192.168.80.100
```

### 方式三：手动部署

参考 `manual-deploy.md` 文件中的详细步骤。

## ⚙️ 部署前准备

### 1. 本地环境要求
- **Node.js**: 16+
- **pnpm**: 最新版本
- **SSH客户端**: OpenSSH 或 Git Bash（Windows）

### 2. 服务器要求
- **操作系统**: Ubuntu 18.04+ / CentOS 7+ / Debian 9+
- **内存**: 最低1GB，推荐2GB+
- **网络**: 能访问192.168.80.75:8000（后端API）
- **SSH访问**: 需要SSH登录权限

### 3. 网络要求
- 开发机器能SSH连接到目标服务器
- 目标服务器能访问192.168.80.75:8000（后端API服务器）
- 目标服务器的80端口对外开放

## 🔧 配置说明

### 关键配置项

1. **服务器IP**: 默认192.168.80.75，可通过参数修改
2. **部署路径**: `/var/www/kunpeng-system`
3. **API代理**: `/Manage` → `http://192.168.80.75:8000`
4. **Nginx配置**: `/etc/nginx/sites-available/kunpeng-system`

### 自定义配置

如需修改配置，编辑 `deploy/nginx.conf` 文件：

```nginx
# 修改服务器IP
server_name your-domain.com;  # 改为你的域名或IP

# 修改API服务器地址
proxy_pass http://your-api-server:8000;  # 改为你的API服务器
```

## 🛠️ 故障排除

### 1. SSH连接失败
```bash
# 检查SSH服务
ssh -v username@server-ip

# 常见解决方案：
# - 检查服务器IP是否正确
# - 确认SSH服务已启动
# - 验证用户名和密码/密钥
```

### 2. 构建失败
```bash
# 清理并重新安装依赖
rm -rf node_modules
pnpm install

# 检查Node.js版本
node --version  # 需要16+
```

### 3. 网站无法访问
```bash
# 在服务器上检查Nginx状态
systemctl status nginx

# 检查端口占用
netstat -tlnp | grep :80

# 查看错误日志
tail -f /var/log/nginx/kunpeng-error.log
```

### 4. API请求失败
```bash
# 测试后端连通性
curl http://192.168.80.75:8000/Manage/test

# 检查Nginx代理配置
nginx -t
```

## 📊 部署后验证

### 1. 基本功能检查
- [ ] 网站首页能正常访问
- [ ] 登录功能正常
- [ ] 菜单导航正常
- [ ] API请求正常

### 2. 性能检查
```bash
# 检查页面加载速度
curl -w "@curl-format.txt" -o /dev/null -s http://your-server-ip

# 检查服务器资源使用
top
free -h
df -h
```

## 🔄 更新部署

### 快速更新
```bash
# 重新运行部署脚本即可
./deploy/deploy.bat 192.168.80.100 root
```

### 手动更新
```bash
# 1. 本地构建
pnpm run build:prod

# 2. 上传新版本
scp -r dist/* root@server-ip:/var/www/kunpeng-system/

# 3. 清除浏览器缓存
```

## 📞 技术支持

如果遇到问题，请检查：

1. **部署日志**: 脚本执行过程中的输出信息
2. **Nginx日志**: `/var/log/nginx/kunpeng-error.log`
3. **系统日志**: `journalctl -u nginx`

---

**部署成功后，你的鲲鹏煎药管理控制系统就可以在服务器上稳定运行了！** 🎉
