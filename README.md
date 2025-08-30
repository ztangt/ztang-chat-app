# 🤖 ZTang AI Chat App

一个基于 React + TypeScript + Vite 构建的现代化 AI 聊天应用，现已支持通过 Cloudflare Workers API 调用 OpenAI 服务。

## ✨ 特性

- 🎨 **现代化 UI 设计** - 采用 Tailwind CSS，支持渐变背景和玻璃拟态效果
- 💬 **真实 AI 对话** - 通过 Cloudflare Workers 代理调用 OpenAI API
- 🔧 **API Key 管理** - 安全的 API Key 配置和验证
- 🌐 **连接状态监控** - 实时显示 API 连接状态
- 🎭 **动画效果** - 丰富的过渡动画和加载状态
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ⚡ **快速开发** - Vite 提供极速的开发体验
- 🔧 **TypeScript** - 完整的类型安全保障
- 🔄 **错误处理** - 完善的错误处理和重试机制
- ⚙️ **模块化架构** - 清晰的服务层和配置管理

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0
- 运行中的 Cloudflare Workers API (默认: http://localhost:8787)

### 安装依赖

```bash
git clone https://github.com/ztangt/ztang-chat-app.git
cd ztang-chat-app
npm install
```

### 配置 API

1. **启动 Cloudflare Workers API**：
   ```bash
   # 在 cloudflare-openai-worker 项目中
   npm run dev  # 启动在 localhost:8787
   ```

2. **设置环境变量**（可选）：
   创建 `.env` 文件：
   ```bash
   REACT_APP_API_BASE_URL=http://localhost:8787
   ```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 使用说明

1. **配置 API Key**：
   - 点击右上角的设置图标
   - 输入你的 OpenAI API Key (sk-xxxxx...)
   - 点击"测试连接"确认配置正确

2. **开始对话**：
   - 在输入框中输入消息
   - 按 Enter 键或点击发送按钮
   - 等待 AI 回复

## 🛠️ 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **图标库**: Lucide React
- **状态管理**: React Hooks
- **API 层**: 自定义服务层
- **代码检查**: ESLint

## 📁 项目结构

```
ztang-chat-app/
├── public/                 # 静态资源
├── src/
│   ├── components/        # React 组件
│   ├── config/           # 配置文件
│   │   └── api.ts        # API 配置和类型定义
│   ├── services/         # 服务层
│   │   └── chatAPI.ts    # API 服务封装
│   ├── App.tsx           # 主应用组件
│   ├── App.css           # 组件样式
│   ├── index.css         # 全局样式
│   └── main.tsx          # 应用入口
├── index.html            # HTML 模板
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── tailwind.config.js    # Tailwind CSS 配置
├── vite.config.ts        # Vite 配置
└── README.md             # 项目文档
```

## 🎨 界面功能

### 主要特性
- **智能聊天界面** - 清新的渐变背景，现代化的消息气泡设计
- **连接状态指示器** - 实时显示与 API 的连接状态
- **设置面板** - 便捷的 API Key 配置和连接测试
- **错误提示** - 友好的错误消息显示和处理
- **打字动画** - 优雅的打字指示器和消息动画

### 交互特性
- **快捷键支持** - Enter 发送消息，Shift+Enter 换行
- **自动滚动** - 新消息自动滚动到底部
- **消息时间戳** - 显示每条消息的发送时间
- **响应式输入框** - 自适应高度的文本输入区域

## 🔧 配置说明

### API 配置

在 `src/config/api.ts` 中可以修改 API 相关配置：

```typescript
export const API_CONFIG: APIConfig = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8787',
  chatEndpoint: '/chat',
  timeout: 30000, // 30秒
  retries: 3, // 重试次数
};
```

### OpenAI 配置

```typescript
export const OPENAI_CONFIG: OpenAIConfig = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 1000,
};
```

## 🔌 API 集成

本应用通过 Cloudflare Workers 代理调用 OpenAI API，提供以下优势：

- **安全性** - API Key 不直接暴露给客户端
- **性能** - 利用 Cloudflare 全球边缘网络
- **稳定性** - 内置重试机制和错误处理
- **成本控制** - 可以在 Worker 层面实现访问控制

### 相关项目

- [cloudflare-openai-worker](https://github.com/ztangt/cloudflare-openai-worker) - 配套的 Cloudflare Workers API 服务

## 🛡️ 错误处理

应用包含完善的错误处理机制：

- **网络错误** - 自动重试和友好提示
- **API Key 错误** - 格式验证和错误提示
- **服务器错误** - 清晰的错误消息显示
- **超时处理** - 30秒请求超时保护

## 🔄 开发流程

1. **本地开发**：
   ```bash
   # 启动 Workers API
   cd ../cloudflare-openai-worker
   npm run dev
   
   # 启动前端应用
   cd ztang-chat-app
   npm run dev
   ```

2. **生产部署**：
   ```bash
   # 构建应用
   npm run build
   
   # 预览构建结果
   npm run preview
   ```

## 🧪 测试

### 手动测试步骤

1. 启动应用和 API 服务
2. 配置有效的 OpenAI API Key
3. 测试基本对话功能
4. 验证错误处理（无效 API Key、网络断开等）
5. 测试响应式设计（不同屏幕尺寸）

## 📋 待办事项

- [ ] 添加消息历史持久化
- [ ] 实现对话上下文管理
- [ ] 添加多模型支持选择
- [ ] 实现深色主题模式
- [ ] 添加文件上传功能
- [ ] 实现语音输入/输出
- [ ] 添加消息搜索功能
- [ ] 实现消息导出功能

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

### v0.2.0 - API 集成版本
- 🔌 集成 Cloudflare Workers API
- ⚙️ 添加 API Key 配置管理
- 🌐 实现连接状态监控
- 🔄 完善错误处理和重试机制
- 📁 重构项目结构，添加服务层

### v0.1.0 - 初始版本
- 🎉 基础聊天界面
- 🎨 现代化 UI 设计
- 📱 响应式布局

## ⚠️ 注意事项

1. **API Key 安全**：请妥善保管你的 OpenAI API Key，不要提交到代码仓库
2. **费用控制**：OpenAI API 按使用量收费，建议设置使用限制
3. **网络配置**：确保 localhost:8787 端口可访问（或修改配置）
4. **浏览器兼容性**：推荐使用现代浏览器（Chrome、Firefox、Safari、Edge）

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙋‍♂️ 联系方式

如有问题或建议，请通过以下方式联系：

- GitHub Issues: [提交问题](https://github.com/ztangt/ztang-chat-app/issues)
- Email: ztang1001@gmail.com

## 🔗 相关链接

- [Cloudflare Workers OpenAI Proxy](https://github.com/ztangt/cloudflare-openai-worker)
- [OpenAI API 文档](https://platform.openai.com/docs)
- [React 官方文档](https://react.dev/)
- [Vite 官方文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！