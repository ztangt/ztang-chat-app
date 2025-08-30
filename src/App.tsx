import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageCircle, AlertCircle, Settings } from 'lucide-react';
import './App.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  error?: boolean;
}

// API 配置
const API_CONFIG = {
  baseUrl: 'http://localhost:8787',
  endpoint: '/chat',
  timeout: 30000, // 30秒超时
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '你好！我是 AI 助手，有什么可以帮助你的吗？我现在连接到了 Cloudflare Workers API，可以为你提供更智能的回答！',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 测试API连接
  const testConnection = async () => {
    try {
      setConnectionStatus('connecting');
      const response = await fetch(API_CONFIG.baseUrl, {
        method: 'GET',
        timeout: 5000,
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
        return true;
      } else {
        setConnectionStatus('disconnected');
        return false;
      }
    } catch (error) {
      console.error('API连接测试失败:', error);
      setConnectionStatus('disconnected');
      return false;
    }
  };

  // 调用API获取AI回复
  const callOpenAIAPI = async (message: string): Promise<string> => {
    if (!apiKey.trim()) {
      throw new Error('请先设置 OpenAI API Key');
    }

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: apiKey,
          message: message,
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.data && data.data.message) {
        return data.data.message;
      } else {
        throw new Error(data.message || 'API返回数据格式错误');
      }
    } catch (error) {
      console.error('API调用失败:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // 调用API获取AI回复
      const aiResponseText = await callOpenAIAPI(currentMessage);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('获取AI回复失败:', error);
      
      // 显示错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `抱歉，我现在无法回复您的消息。错误原因: ${error instanceof Error ? error.message : '未知错误'}`,
        sender: 'ai',
        timestamp: new Date(),
        error: true
      };

      setMessages(prev => [...prev, errorMessage]);
      setConnectionStatus('disconnected');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 组件挂载时测试连接
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MessageCircle className="w-8 h-8 text-primary-600" />
                <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">ZTang AI Chat</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>智能对话助手</span>
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500' : 
                    connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
                    'bg-red-500'
                  }`}></div>
                  <span className="text-xs">
                    {connectionStatus === 'connected' ? 'API已连接' : 
                     connectionStatus === 'connecting' ? '连接中...' : 
                     'API未连接'}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="设置"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* 设置面板 */}
          {showSettings && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">API 设置</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">OpenAI API Key:</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={testConnection}
                    className="px-3 py-1 text-xs bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    测试连接
                  </button>
                  <span className="text-xs text-gray-500">
                    API地址: {API_CONFIG.baseUrl}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-slide-up ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'ai' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.error ? 'bg-red-100' : 'bg-primary-100'
                }`}>
                  {message.error ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Bot className="w-5 h-5 text-primary-600" />
                  )}
                </div>
              )}
              
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-br-md'
                    : message.error
                    ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-md'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-primary-200' : 
                  message.error ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-600" />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-200">
          {/* API Key 提醒 */}
          {!apiKey && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span>请先在设置中配置 OpenAI API Key 才能使用 AI 对话功能</span>
              </div>
            </div>
          )}
          
          <div className="flex gap-3 items-end max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={apiKey ? "输入您的消息..." : "请先设置 API Key..."}
                disabled={!apiKey || isTyping}
                className="w-full p-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none min-h-[48px] max-h-32 disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={1}
                style={{ 
                  height: 'auto',
                  minHeight: '48px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping || !apiKey}
              className="w-12 h-12 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-2xl flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;