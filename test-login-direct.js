const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');

// MD5加密函数
function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

// 测试登录函数
async function testLogin(username, password) {
    return new Promise((resolve, reject) => {
        const hashedPassword = md5(password);
        const postData = querystring.stringify({
            username: username,
            password: hashedPassword
        });

        console.log(`测试登录: ${username} / ${password}`);
        console.log(`原始密码: ${password}, MD5: ${hashedPassword}`);

        const options = {
            hostname: '192.168.80.75',
            port: 8000,
            path: '/Manage/UserLogin/ProcessLogin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Length': Buffer.byteLength(postData)
            },
            // 忽略SSL证书错误
            rejectUnauthorized: false
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    console.log(`响应:`, result);
                    resolve(result);
                } catch (e) {
                    console.log(`原始响应:`, data);
                    resolve({ error: '解析JSON失败', raw: data });
                }
            });
        });

        req.on('error', (e) => {
            console.error(`请求错误:`, e.message);
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

// 测试不同的凭据组合
async function runTests() {
    console.log('🔐 开始测试登录凭据...\n');
    
    const testCases = [
        ['admin', ''],           // 空密码
        ['admin', '123456'],     // 常见密码
        ['admin', 'admin'],      // 用户名作为密码
        ['admin', '123'],        // 简单密码
        ['admin', 'password'],   // 默认密码
    ];

    for (const [username, password] of testCases) {
        try {
            console.log(`\n--- 测试 ${username} / ${password || '(空)'} ---`);
            const result = await testLogin(username, password);
            
            if (result.code === '0') {
                console.log('✅ 登录成功!');
                console.log('🎯 找到正确凭据:', username, '/', password || '(空)');
                break;
            } else if (result.code === '1001') {
                console.log('❌ 用户名或密码错误');
            } else {
                console.log('⚠️ 未知响应:', result);
            }
        } catch (error) {
            console.error('❌ 请求失败:', error.message);
        }
        
        // 等待一下避免请求过快
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🏁 测试完成');
}

runTests().catch(console.error);
