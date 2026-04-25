#!/usr/bin/env node

/**
 * LLM Integration Demo
 * Shows how to use the FIRE assessment, DCA planning, and rebalancing services
 */

import {
  FIREAssessmentService,
  DCAService,
  RebalancingService,
  LLM_PROVIDERS,
} from '../lib/llm-integration.js'

// Sample user data
const sampleUserData = {
  total_assets: 500000,
  total_liabilities: 200000,
  primary_residence_value: 1500000,
  annual_fixed_expenses: 120000,
  annual_savings: 60000,
  monthly_passive_income: 3000,
  mortgage_balance: 180000,
  monthly_mortgage_payment: 3000,
  other_liabilities: 20000,
  mortgage_rate: 0.035,
  family_status: 'married',
  dependents_count: 1,
  risk_tolerance: 'medium',
  expected_return_rate: 0.07,
  current_allocation: '70% stocks, 30% bonds',
}

async function main() {
  console.log('═'.repeat(70))
  console.log('LLM Integration Demo - Awesome Financial Freedom')
  console.log('═'.repeat(70))
  console.log()

  console.log('📋 Available LLM Providers:')
  console.log()

  Object.entries(LLM_PROVIDERS).forEach(([key, config]) => {
    console.log(`  ${key.toUpperCase()}`)
    console.log(`    Name: ${config.name}`)
    console.log(`    Models: ${config.models.join(', ')}`)
    console.log(
      `    API Key: ${config.apiKey ? '✓ Configured' : '✗ Not configured'}`,
    )
    console.log()
  })

  console.log('═'.repeat(70))
  console.log()

  // Demo 1: FIRE Assessment
  console.log('📊 Demo 1: FIRE Assessment Service')
  console.log('-'.repeat(70))
  console.log('Attempting to use Claude (if API key available)...')
  console.log()

  try {
    const fireService = new FIREAssessmentService('claude', 'claude-3-haiku')
    console.log('✓ FIREAssessmentService initialized')
    console.log(`  Provider: Claude`)
    console.log(`  Model: claude-3-haiku`)
    console.log()
    console.log(
      'Note: In production, this would send user data to Claude API and receive',
    )
    console.log(
      '      a comprehensive FIRE assessment with 8-segment analysis.',
    )
    console.log()
  } catch (error) {
    console.log(`✗ ${error.message}`)
    console.log('  (This is expected if ANTHROPIC_API_KEY is not set)')
    console.log()
  }

  // Demo 2: DCA Service
  console.log('═'.repeat(70))
  console.log('💰 Demo 2: DCA Planning Service')
  console.log('-'.repeat(70))
  console.log('Attempting to use OpenAI (if API key available)...')
  console.log()

  try {
    const dcaService = new DCAService('openai', 'gpt-3.5-turbo')
    console.log('✓ DCAService initialized')
    console.log(`  Provider: OpenAI`)
    console.log(`  Model: gpt-3.5-turbo`)
    console.log()
    console.log(
      'Note: In production, this would send portfolio data to GPT API and receive',
    )
    console.log(
      '      a personalized DCA investment plan with psychological guidance.',
    )
    console.log()
  } catch (error) {
    console.log(`✗ ${error.message}`)
    console.log('  (This is expected if OPENAI_API_KEY is not set)')
    console.log()
  }

  // Demo 3: Rebalancing Service
  console.log('═'.repeat(70))
  console.log('📈 Demo 3: Portfolio Rebalancing Service')
  console.log('-'.repeat(70))
  console.log('Attempting to use Gemini (if API key available)...')
  console.log()

  try {
    const rebalanceService = new RebalancingService('gemini', 'gemini-pro')
    console.log('✓ RebalancingService initialized')
    console.log(`  Provider: Google Gemini`)
    console.log(`  Model: gemini-pro`)
    console.log()
    console.log(
      'Note: In production, this would send portfolio analysis to Gemini API',
    )
    console.log(
      '      and receive rebalancing recommendations with risk management.',
    )
    console.log()
  } catch (error) {
    console.log(`✗ ${error.message}`)
    console.log('  (This is expected if GOOGLE_API_KEY is not set)')
    console.log()
  }

  // Info about setup
  console.log('═'.repeat(70))
  console.log('🔧 Setup Instructions')
  console.log('═'.repeat(70))
  console.log()
  console.log('To enable LLM integration, set environment variables:')
  console.log()
  console.log('  export ANTHROPIC_API_KEY="sk-ant-..."')
  console.log('  export OPENAI_API_KEY="sk-..."')
  console.log('  export GOOGLE_API_KEY="AIza..."')
  console.log()
  console.log('Then run services:')
  console.log()
  console.log('  const service = new FIREAssessmentService("claude");')
  console.log('  const result = await service.getFIREAssessment(userData);')
  console.log('  console.log(result);')
  console.log()
  console.log('═'.repeat(70))
  console.log()
  console.log('✅ LLM Integration layer is ready for use!')
  console.log(
    '   All services support multi-model, multi-provider architecture.',
  )
  console.log('   Prompts are automatically injected with user data.')
  console.log('   Responses include comprehensive financial analysis.')
  console.log()
}

main().catch(console.error)
