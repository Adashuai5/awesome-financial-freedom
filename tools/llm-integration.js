/**
 * LLM Integration Layer
 * Connects awesome-financial-freedom prompts to Claude API via @anthropic-ai/sdk.
 * OpenAI / Gemini stubs preserved for documentation — not yet implemented.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LLM_PROVIDERS = {
  claude: {
    name: 'Anthropic Claude',
    models: ['claude-sonnet-4-6', 'claude-opus-4-7', 'claude-haiku-4-5-20251001'],
    envVar: 'ANTHROPIC_API_KEY',
  },
  openai: {
    name: 'OpenAI GPT',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    envVar: 'OPENAI_API_KEY',
  },
  gemini: {
    name: 'Google Gemini',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
    envVar: 'GOOGLE_API_KEY',
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

class LLMClient {
  constructor(provider = 'claude', model = null) {
    this.config = LLM_PROVIDERS[provider];
    if (!this.config) throw new Error(`Unknown provider: ${provider}`);

    this.provider = provider;
    this.model = model || this.config.models[0];
    this.apiKey = process.env[this.config.envVar];

    if (!this.apiKey) {
      throw new Error(`API key not set for ${provider}. Export ${this.config.envVar}`);
    }
  }

  async sendRequest(messages, systemPrompt) {
    switch (this.provider) {
      case 'claude': return this.sendToClaude(messages, systemPrompt);
      case 'openai': return this.sendToOpenAI(messages, systemPrompt);
      case 'gemini': return this.sendToGemini(messages, systemPrompt);
      default: throw new Error(`Provider ${this.provider} not implemented`);
    }
  }

  async sendToClaude(messages, systemPrompt) {
    const client = new Anthropic({ apiKey: this.apiKey });
    const response = await client.messages.create({
      model: this.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map(({ role, content }) => ({ role, content })),
    });

    const text = response.content.map(b => b.type === 'text' ? b.text : '').join('');
    return {
      provider: this.provider,
      model: this.model,
      status: 'success',
      message: text,
      usage: response.usage,
    };
  }

  async sendToOpenAI(messages, systemPrompt) {
    // Requires: npm install openai
    throw new Error('OpenAI provider not yet implemented. Install openai SDK and implement sendToOpenAI.');
  }

  async sendToGemini(messages, systemPrompt) {
    // Requires: npm install @google/generative-ai
    throw new Error('Gemini provider not yet implemented. Install @google/generative-ai SDK and implement sendToGemini.');
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
