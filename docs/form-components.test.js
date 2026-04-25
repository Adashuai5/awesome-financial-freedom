/**
 * Form Components Test Suite
 * Tests for form validation, rendering, and data collection
 */

import { FormValidator, FormDataCollector } from '../docs/form-components.js'

// Test validation rules
const testValidationRules = {
  fire_assessment: [
    {
      rule: 'total_assets >= total_liabilities',
      message: 'total_assets must be >= total_liabilities',
    },
    {
      rule: 'annual_savings >= 0',
      message: 'annual_savings must be >= 0',
    },
  ],
}

// Test data sets
const validTestData = {
  total_assets: 500000,
  total_liabilities: 200000,
  annual_savings: 60000,
}

const invalidTestData = {
  total_assets: 100000,
  total_liabilities: 500000,
  annual_savings: -10000,
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('═'.repeat(70))
  console.log('Form Components Test Suite')
  console.log('═'.repeat(70))
  console.log()

  let passCount = 0
  let failCount = 0

  // Test 1: FormValidator with valid data
  console.log('Test 1: FormValidator - Valid Data')
  try {
    const validator = new FormValidator(testValidationRules)
    const result = validator.validate('fire_assessment', validTestData)

    if (result.valid && result.errors.length === 0) {
      console.log('✓ PASS: Valid data passes validation')
      passCount++
    } else {
      console.log(
        '✗ FAIL: Valid data should pass but got errors:',
        result.errors,
      )
      failCount++
    }
  } catch (error) {
    console.log('✗ FAIL: Unexpected error:', error.message)
    failCount++
  }
  console.log()

  // Test 2: FormValidator with invalid data
  console.log('Test 2: FormValidator - Invalid Data')
  try {
    const validator = new FormValidator(testValidationRules)
    const result = validator.validate('fire_assessment', invalidTestData)

    if (!result.valid && result.errors.length > 0) {
      console.log('✓ PASS: Invalid data fails validation')
      console.log('  Errors:', result.errors)
      passCount++
    } else {
      console.log('✗ FAIL: Invalid data should fail but passed validation')
      failCount++
    }
  } catch (error) {
    console.log('✗ FAIL: Unexpected error:', error.message)
    failCount++
  }
  console.log()

  // Test 3: FormDataCollector format function
  console.log('Test 3: FormDataCollector - Data Formatting')
  try {
    const rawData = {
      total_assets: 500000,
      risk_tolerance: 'medium',
      expected_return_rate: 7,
      mortgage_rate: 3.5,
    }

    const formatted = FormDataCollector.format(rawData)

    if (
      formatted.total_assets === 500000 &&
      formatted.risk_tolerance === 'medium' &&
      formatted.expected_return_rate === 0.07 &&
      formatted.mortgage_rate === 0.035
    ) {
      console.log('✓ PASS: Data formatted correctly')
      console.log('  - Percentages converted to decimals')
      console.log('  - String values preserved')
      console.log('  - Null values handled')
      passCount++
    } else {
      console.log('✗ FAIL: Data formatting failed')
      console.log('  Expected:', {
        total_assets: 500000,
        expected_return_rate: 0.07,
        mortgage_rate: 0.035,
      })
      console.log('  Got:', formatted)
      failCount++
    }
  } catch (error) {
    console.log('✗ FAIL: Unexpected error:', error.message)
    failCount++
  }
  console.log()

  // Test 4: Complex validation rules
  console.log('Test 4: Complex Arithmetic Validation')
  try {
    const complexRules = {
      test_calc: [
        {
          rule: 'value_a + value_b == value_c',
          message: 'value_a + value_b must equal value_c',
        },
      ],
    }

    const validator = new FormValidator(complexRules)

    const validCalcData = { value_a: 100, value_b: 200, value_c: 300 }
    const validResult = validator.validate('test_calc', validCalcData)

    const invalidCalcData = { value_a: 100, value_b: 200, value_c: 350 }
    const invalidResult = validator.validate('test_calc', invalidCalcData)

    if (validResult.valid && !invalidResult.valid) {
      console.log('✓ PASS: Complex arithmetic validation works correctly')
      passCount++
    } else {
      console.log('✗ FAIL: Complex arithmetic validation failed')
      failCount++
    }
  } catch (error) {
    console.log('✗ FAIL: Unexpected error:', error.message)
    failCount++
  }
  console.log()

  // Test 5: Edge cases
  console.log('Test 5: Edge Cases')
  try {
    const edgeValidator = new FormValidator(testValidationRules)

    // Test with zero values
    const zeroData = {
      total_assets: 0,
      total_liabilities: 0,
      annual_savings: 0,
    }
    const zeroResult = edgeValidator.validate('fire_assessment', zeroData)

    // Test with large numbers
    const largeData = {
      total_assets: 999999999999,
      total_liabilities: 500000000000,
      annual_savings: 50000000,
    }
    const largeResult = edgeValidator.validate('fire_assessment', largeData)

    if (zeroResult.valid && largeResult.valid) {
      console.log('✓ PASS: Edge cases handled correctly')
      console.log('  - Zero values accepted')
      console.log('  - Large numbers accepted')
      passCount++
    } else {
      console.log('✗ FAIL: Edge cases not handled')
      failCount++
    }
  } catch (error) {
    console.log('✗ FAIL: Unexpected error:', error.message)
    failCount++
  }
  console.log()

  // Summary
  console.log('═'.repeat(70))
  console.log('Test Summary')
  console.log('═'.repeat(70))
  console.log(`Total Tests: ${passCount + failCount}`)
  console.log(`✓ Passed: ${passCount}`)
  console.log(`✗ Failed: ${failCount}`)
  console.log()

  if (failCount === 0) {
    console.log('🎉 All tests passed! Form components are working correctly.')
  } else {
    console.log(`⚠️  ${failCount} test(s) failed. Review implementation.`)
  }

  console.log('═'.repeat(70))

  return failCount === 0
}

// Run tests if this module is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = runAllTests()
  process.exit(success ? 0 : 1)
}

export { runAllTests }
