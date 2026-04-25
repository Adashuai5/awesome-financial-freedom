/**
 * LLM Integration Layer
 * Connects awesome-financial-freedom prompts to various LLM APIs
 * Supports: Claude, OpenAI GPT, Google Gemini, Open-source Llama
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * LLM Provider Configuration
 */
const LLM_PROVIDERS = {
  claude: {
    name: 'Anthropic Claude',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    apiKey: process.env.ANTHROPIC_API_KEY,
    endpoint: 'https://api.anthropic.com/v1/messages',
  },
  openai: {
    name: 'OpenAI GPT',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    apiKey: process.env.OPENAI_API_KEY,
    endpoint: 'https://api.openai.com/v1/chat/completions',
  },
  gemini: {
    name: 'Google Gemini',
    models: ['gemini-pro', 'gemini-pro-vision'],
    apiKey: process.env.GOOGLE_API_KEY,
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
  },
};

/**
 * Load prompt template from file
 */
function loadPrompt(promptName) {
  const promptPath = path.join(__dirname, '..', 'prompts', `${promptName}.md`);
  try {
    return fs.readFileSync(promptPath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to load prompt ${promptName}: ${error.message}`);
  }
}

/**
 * Inject user data into prompt template
 */
function injectUserData(promptTemplate, userData) {
  let result = promptTemplate;
  
  // Replace all {{input.variable}} patterns with actual user data
  const variableRegex = /\{\{input\.(\w+)\}\}/g;
  result = result.replace(variableRegex, (match, key) => {
    return userData[key] !== undefined ? userData[key] : match;
  });
  
  return result;
}

/**
 * Format user data for prompt injection
 */
function formatUserData(rawData) {
  return {
    total_assets: `¥${rawData.total_assets?.toLocaleString() || 0}`,
    total_liabilities: `¥${rawData.total_liabilities?.toLocaleString() || 0}`,
    primary_residence_value: `¥${rawData.primary_residence_value?.toLocaleString() || 0}`,
    annual_fixed_expenses: `¥${rawData.annual_fixed_expenses?.toLocaleString() || 0}`,
    annual_savings: `¥${rawData.annual_savings?.toLocaleString() || 0}`,
    monthly_passive_income: `¥${rawData.monthly_passive_income?.toLocaleString() || 0}`,
    mortgage_balance: `¥${rawData.mortgage_balance?.toLocaleString() || 0}`,
    monthly_mortgage_payment: `¥${rawData.monthly_mortgage_payment?.toLocaleString() || 0}`,
    other_liabilities: `¥${rawData.other_liabilities?.toLocaleString() || 0}`,
    mortgage_rate: `${(rawData.mortgage_rate * 100).toFixed(2)}%`,
    family_status: rawData.family_status || 'unknown',
    dependents_count: rawData.dependents_count || 0,
    risk_tolerance: rawData.risk_tolerance || 'medium',
    expected_return_rate: `${(rawData.expected_return_rate * 100).toFixed(1)}%`,
    current_allocation: rawData.current_allocation || 'unknown',
  };
}

/**
 * LLM Client - Abstract interface for different providers
 */
class LLMClient {
  constructor(provider = 'claude', model = null) {
    this.provider = provider;
    this.config = LLM_PROVIDERS[provider];
    
    if (!this.config) {
      throw new Error(`Unknown provider: ${provider}`);
    }
    
    this.model = model || this.config.models[0];
    this.apiKey = this.config.apiKey;
    
    if (!this.apiKey) {
      throw new Error(`API key not configured for ${provider}. Set ${this.getEnvVarName()}`);
    }
  }

  getEnvVarName() {
    const envMap = {
      claude: 'ANTHROPIC_API_KEY',
      openai: 'OPENAI_API_KEY',
      gemini: 'GOOGLE_API_KEY',
    };
    return envMap[this.provider];
  }

  /**
   * Send request to LLM based on provider
   */
  async sendRequest(messages, systemPrompt) {
    switch (this.provider) {
      case 'claude':
        return this.sendToClaude(messages, systemPrompt);
      case 'openai':
        return this.sendToOpenAI(messages, systemPrompt);
      case 'gemini':
        return this.sendToGemini(messages, systemPrompt);
      default:
        throw new Error(`Provider ${this.provider} not implemented`);
    }
  }

  /**
   * Claude API call format
   */
  async sendToClaude(messages, systemPrompt) {
    // This is a reference implementation
    // In production, use @anthropic-ai/sdk
    const payload = {
      model: this.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    };

    console.log(`[${this.provider}] Sending request to Claude API...`);
    console.log(`Model: ${this.model}`);
    console.log(`Messages: ${messages.length}`);
    
    // In production, make actual HTTP request:
    // const response = await fetch(this.config.endpoint, {
    //   method: 'POST',
    //   headers: {
    //     'x-api-key': this.apiKey,
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify(payload),
    // });
    
    return {
      provider: this.provider,
      model: this.model,
      status: 'mock',
      message: 'Mock response for demonstration',
      usage: { input_tokens: 100, output_tokens: 50 },
    };
  }

  /**
   * OpenAI API call format
   */
  async sendToOpenAI(messages, systemPrompt) {
    const payload = {
      model: this.model,
      max_tokens: 2048,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    };

    console.log(`[${this.provider}] Sending request to OpenAI API...`);
    console.log(`Model: ${this.model}`);
    
    // In production:
    // const response = await fetch(this.config.endpoint, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(payload),
    // });
    
    return {
      provider: this.provider,
      model: this.model,
      status: 'mock',
      message: 'Mock response for demonstration',
      usage: { prompt_tokens: 100, completion_tokens: 50 },
    };
  }

  /**
   * Google Gemini API call format
   */
  async sendToGemini(messages, systemPrompt) {
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    console.log(`[${this.provider}] Sending request to Gemini API...`);
    console.log(`Model: ${this.model}`);
    
    // In production:
    // const endpoint = `${this.config.endpoint}/${this.model}:generateContent`;
    // const response = await fetch(endpoint, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-goog-api-key': this.apiKey,
    //   },
    //   body: JSON.stringify({ contents }),
    // });
    
    return {
      provider: this.provider,
      model: this.model,
      status: 'mock',
      message: 'Mock response for demonstration',
      usage: { prompt_tokens: 100, output_tokens: 50 },
    };
  }
}

/**
 * FIRE Assessment Service
 */
class FIREAssessmentService {
  constructor(provider = 'claude', model = null) {
    this.client = new LLMClient(provider, model);
  }

  /**
   * Get FIRE assessment from LLM
   */
  async getFIREAssessment(userData) {
    try {
      // Load system prompt
      const systemPrompt = loadPrompt('system');
      
      // Load FIRE assessment prompt
      const assessmentPrompt = loadPrompt('fire_assessment');
      
      // Format and inject user data
      const formattedData = formatUserData(userData);
      const userMessage = injectUserData(assessmentPrompt, formattedData);
      
      // Send to LLM
      const response = await this.client.sendRequest(
        [{ role: 'user', content: userMessage }],
        systemPrompt
      );
      
      return {
        service: 'FIRE Assessment',
        provider: this.client.provider,
        model: this.client.model,
        userData: formattedData,
        response: response,
      };
    } catch (error) {
      throw new Error(`FIRE Assessment failed: ${error.message}`);
    }
  }
}

/**
 * DCA Planning Service
 */
class DCAService {
  constructor(provider = 'claude', model = null) {
    this.client = new LLMClient(provider, model);
  }

  /**
   * Get DCA plan from LLM
   */
  async getDCAPlan(userData) {
    try {
      const systemPrompt = loadPrompt('system');
      const dcaPrompt = loadPrompt('dca_summary');
      
      const formattedData = formatUserData(userData);
      const userMessage = injectUserData(dcaPrompt, formattedData);
      
      const response = await this.client.sendRequest(
        [{ role: 'user', content: userMessage }],
        systemPrompt
      );
      
      return {
        service: 'DCA Planning',
        provider: this.client.provider,
        model: this.client.model,
        response: response,
      };
    } catch (error) {
      throw new Error(`DCA Planning failed: ${error.message}`);
    }
  }
}

/**
 * Portfolio Rebalancing Service
 */
class RebalancingService {
  constructor(provider = 'claude', model = null) {
    this.client = new LLMClient(provider, model);
  }

  /**
   * Get rebalancing plan from LLM
   */
  async getRebalancingPlan(portfolioData) {
    try {
      const systemPrompt = loadPrompt('system');
      const rebalancePrompt = loadPrompt('rebalancing_plan');
      
      const formattedData = formatUserData(portfolioData);
      const userMessage = injectUserData(rebalancePrompt, formattedData);
      
      const response = await this.client.sendRequest(
        [{ role: 'user', content: userMessage }],
        systemPrompt
      );
      
      return {
        service: 'Portfolio Rebalancing',
        provider: this.client.provider,
        model: this.client.model,
        response: response,
      };
    } catch (error) {
      throw new Error(`Rebalancing failed: ${error.message}`);
    }
  }
}

/**
 * Export services and utilities
 */
export {
  LLMClient,
  FIREAssessmentService,
  DCAService,
  RebalancingService,
  loadPrompt,
  injectUserData,
  formatUserData,
  LLM_PROVIDERS,
};
