/**
 * 患者API测试文件
 * 用于测试PatientList接口调用
 */

// 测试患者列表API
async function testPatientListAPI() {
  try {
    console.log('开始测试患者列表API...');
    
    // 模拟API调用参数
    const params = {
      page: 1,
      limit: 20,
      name: '' // 可选的搜索参数
    };
    
    // 使用fetch直接调用API
    const response = await fetch('/Manage/PatientManagement/PatientList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
        'Cookie': 'ASPNET_SessionId=iuvfmnvxt2dr31jpr12s52y',
        'Host': '192.168.80.79:8000',
        'Origin': 'http://192.168.80.79:8000',
        'Referer': 'http://192.168.80.79:8000/AdminUi/start/index.html?',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: new URLSearchParams(params)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('API调用成功:', data);
      
      // 验证响应格式
      if (data.code === '0') {
        console.log('✅ 接口返回成功');
        console.log('📊 数据总数:', data.count);
        console.log('📋 数据列表长度:', data.data?.length || 0);
        
        // 显示前3条数据作为示例
        if (data.data && data.data.length > 0) {
          console.log('📝 前3条数据示例:');
          data.data.slice(0, 3).forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.name} - ${item.phone} - ${item.address}`);
          });
        }
      } else {
        console.log('❌ 接口返回错误:', data.msg);
      }
    } else {
      console.log('❌ HTTP请求失败:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ API测试失败:', error);
  }
}

// 在浏览器控制台中运行测试
if (typeof window !== 'undefined') {
  window.testPatientListAPI = testPatientListAPI;
  console.log('💡 患者API测试函数已加载，在控制台运行 testPatientListAPI() 进行测试');
}

export { testPatientListAPI };
