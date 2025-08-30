/**
 * 🔧 API 连接诊断工具
 * 在浏览器控制台中运行此脚本来诊断 API 连接问题
 */

async function diagnoseAPI() {
  console.log('🔍 开始诊断 API 连接...\n');
  
  const API_BASE = 'http://localhost:8787';
  
  // 1. 测试基础连接
  console.log('1️⃣ 测试基础 API 连接...');
  try {
    const response = await fetch(API_BASE);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 基础连接成功');
      console.log('📋 API 信息:', data);
    } else {
      console.log('❌ 基础连接失败:', response.status, response.statusText);
      return;
    }
  } catch (error) {
    console.log('❌ 基础连接异常:', error.message);
    console.log('💡 请确保 Cloudflare Workers 在 localhost:8787 运行');
    return;
  }
  
  // 2. 测试聊天端点（不带 API Key）
  console.log('\n2️⃣ 测试聊天端点（预期失败）...');
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: 'invalid-key',
        message: 'test'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('⚠️ 意外成功（应该验证 API Key）');
    } else {
      console.log('✅ 正确拒绝无效 API Key');
      console.log('📋 错误信息:', data);
    }
  } catch (error) {
    console.log('❌ 聊天端点请求异常:', error.message);
  }
  
  // 3. 检查 CORS 设置
  console.log('\n3️⃣ 检查 CORS 配置...');
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'OPTIONS'
    });
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
    };
    
    console.log('✅ CORS 头部信息:');
    console.log(corsHeaders);
    
    if (corsHeaders['access-control-allow-origin'] === '*') {
      console.log('✅ CORS 配置正确');
    } else {
      console.log('⚠️ CORS 可能有问题');
    }
  } catch (error) {
    console.log('❌ CORS 检查失败:', error.message);
  }
  
  // 4. 测试网络连接
  console.log('\n4️⃣ 测试网络延迟...');
  try {
    const start = Date.now();
    await fetch(API_BASE);
    const delay = Date.now() - start;
    console.log(`✅ 网络延迟: ${delay}ms`);
  } catch (error) {
    console.log('❌ 网络测试失败:', error.message);
  }
  
  console.log('\n🏁 诊断完成!');
  console.log('💡 如果基础连接失败，请检查:');
  console.log('   1. Cloudflare Workers 是否在运行 (npm run dev)');
  console.log('   2. 端口 8787 是否被其他程序占用');
  console.log('   3. 防火墙是否阻止了连接');
}

// 自动运行诊断
diagnoseAPI().catch(console.error);

// 也可以手动调用
window.diagnoseAPI = diagnoseAPI;