# 🤖 ZTang AI Chat App

一个基于 React + TypeScript + Vite 构建的现代化 AI 聊天应用。

## ✨ 特性

- 🎨 **现代化 UI 设计** - 采用 Tailwind CSS，支持渐变背景和玻璃拟态效果
- 💬 **实时消息交互** - 流畅的消息发送和接收体验
- 🎭 **动画效果** - 丰富的过渡动画和加载状态
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ⚡ **快速开发** - Vite 提供极速的开发体验
- 🔧 **TypeScript** - 完整的类型安全保障
- 🎯 **组件化** - 可复用的 React 组件架构

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 预览生产版本

```bash
npm run preview
# 或
yarn preview
```

## 🛠️ 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **图标库**: Lucide React
- **代码检查**: ESLint
- **包管理**: npm/yarn

## 📁 项目结构

```
ztang-chat-app/
├── public/                 # 静态资源
├── src/
│   ├── components/        # React 组件
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

## 🎨 界面展示

### 主界面特点
- 清新的渐变背景
- 现代化的聊天界面
- 流畅的消息动画
- 智能的输入框自适应
- 优雅的打字指示器

### 交互特性
- 支持 Enter 键发送消息
- 自动滚动到最新消息
- 消息时间戳显示
- 发送按钮状态管理

## 🔧 自定义配置

### 修改主题颜色

在 `tailwind.config.js` 中修改 primary 颜色配置：

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        900: '#1e3a8a',
      }
    }
  }
}
```

### 添加新的动画效果

在 `src/App.css` 中添加自定义动画：

```css
@keyframes customAnimation {
  from { /* 起始状态 */ }
  to { /* 结束状态 */ }
}

.custom-class {
  animation: customAnimation 0.3s ease-out;
}
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

### v0.1.0
- 🎉 初始版本发布
- ✨ 基础聊天功能
- 🎨 现代化 UI 设计
- 📱 响应式布局

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙋‍♂️ 联系方式

如有问题或建议，请通过以下方式联系：

- GitHub Issues: [提交问题](https://github.com/ztangt/ztang-chat-app/issues)
- Email: 你的邮箱地址

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！