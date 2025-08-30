/**
 * API 服务层
 * 封装所有与后端API的交互逻辑
 */

import { 
  API_CONFIG, 
  OPENAI_CONFIG, 
  APIResponse, 
  ChatRequest, 
  validateApiKey, 
  getApiUrl, 
  getErrorMessage 
} from '../config/api';

export class ChatAPIService {
  private static instance: ChatAPIService;

  private constructor() {}

  public static getInstance(): ChatAPIService {
    if (!ChatAPIService.instance) {
      ChatAPIService.instance = new ChatAPIService();
    }
    return ChatAPIService.instance;
  }

  /**
   * 测试API连接
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(API_CONFIG.baseUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5秒超时
      });
      
      return response.ok;
    } catch (error) {
      console.error('API连接测试失败:', error);
      return false;
    }
  }

  /**
   * 发送聊天消息
   */
  async sendMessage(apiKey: string, message: string, options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> {
    // 验证API Key
    if (!validateApiKey(apiKey)) {
      throw new Error('API Key 格式无效，请检查您的 OpenAI API Key');
    }

    // 准备请求数据
    const requestData: ChatRequest = {
      apiKey,
      message,
      model: options?.model || OPENAI_CONFIG.model,
      temperature: options?.temperature || OPENAI_CONFIG.temperature,
      max_tokens: options?.maxTokens || OPENAI_CONFIG.maxTokens,
    };

    try {
      const response = await this.makeRequest(getApiUrl(), requestData);
      
      if (response.success && response.data?.message) {
        return response.data.message;
      } else {
        throw new Error(response.message || response.error || 'API返回数据格式错误');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * 发送HTTP请求（带重试机制）
   */
  private async makeRequest(url: string, data: ChatRequest, retryCount: number = 0): Promise<APIResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error: any) {
      // 如果是网络错误且还有重试次数，则重试
      if (retryCount < API_CONFIG.retries && this.shouldRetry(error)) {
        console.warn(`请求失败，正在重试 (${retryCount + 1}/${API_CONFIG.retries})...`);
        await this.delay(1000 * (retryCount + 1)); // 递增延迟
        return this.makeRequest(url, data, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: any): boolean {
    // 网络错误、超时错误、5xx服务器错误可以重试
    return (
      error.name === 'TypeError' ||
      error.name === 'AbortError' ||
      (error.message && error.message.includes('50'))
    );
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取API状态信息
   */
  async getAPIStatus(): Promise<any> {
    try {
      const response = await fetch(API_CONFIG.baseUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
}

// 导出单例实例
export const chatAPI = ChatAPIService.getInstance();