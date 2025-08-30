/**
 * API 配置文件
 * 用于管理聊天应用的API相关配置
 */

export interface APIConfig {
  baseUrl: string;
  chatEndpoint: string;
  timeout: number;
  retries: number;
}

export interface OpenAIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

// 🔧 根据环境选择 API 地址
const getBaseUrl = (): string => {
  // 如果设置了环境变量，使用环境变量
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // 开发环境使用代理避免跨域问题
  if (process.env.NODE_ENV === 'development') {
    return '/api'; // 通过 Vite 代理
  }
  
  // 生产环境直接访问
  return 'http://localhost:8787';
};

// 默认API配置
export const API_CONFIG: APIConfig = {
  baseUrl: getBaseUrl(),
  chatEndpoint: '/chat',
  timeout: 30000, // 30秒
  retries: 3, // 重试次数
};

// 默认OpenAI配置
export const OPENAI_CONFIG: OpenAIConfig = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 1000,
};

// API响应接口定义
export interface APIResponse {
  success: boolean;
  data?: {
    message: string;
    model: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    id: string;
  };
  error?: string;
  message?: string;
  code?: string;
}

// 聊天请求接口定义
export interface ChatRequest {
  apiKey: string;
  message: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

// 验证API Key格式
export const validateApiKey = (apiKey: string): boolean => {
  return apiKey && apiKey.startsWith('sk-') && apiKey.length > 20;
};

// 获取完整的API URL
export const getApiUrl = (endpoint: string = API_CONFIG.chatEndpoint): string => {
  return `${API_CONFIG.baseUrl}${endpoint}`;
};

// 错误消息映射
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接错误，请检查您的网络连接',
  API_KEY_INVALID: 'API Key 格式无效，请检查您的 OpenAI API Key',
  API_KEY_MISSING: '请先设置 OpenAI API Key',
  SERVER_ERROR: '服务器错误，请稍后重试',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  UNKNOWN_ERROR: '未知错误，请稍后重试',
  CORS_ERROR: '跨域请求被阻止，请检查服务器配置',
} as const;

// 根据错误类型获取友好的错误消息
export const getErrorMessage = (error: any): string => {
  if (!error) return ERROR_MESSAGES.UNKNOWN_ERROR;

  // 跨域错误
  if (error.message?.includes('CORS') || error.message?.includes('cors')) {
    return ERROR_MESSAGES.CORS_ERROR;
  }

  // 网络错误
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // 超时错误
  if (error.name === 'AbortError' || error.message?.includes('timeout')) {
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  }

  // API Key 相关错误
  if (error.message?.includes('API Key') || error.message?.includes('api key')) {
    return ERROR_MESSAGES.API_KEY_INVALID;
  }

  // HTTP 状态码错误
  if (error.message?.includes('401')) {
    return ERROR_MESSAGES.API_KEY_INVALID;
  }

  if (error.message?.includes('500') || error.message?.includes('502') || error.message?.includes('503')) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }

  // 返回原始错误消息或默认错误消息
  return error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
};