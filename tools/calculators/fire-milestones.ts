// FIRE Milestones Calculator
// Calculates key milestones on the path to financial independence

export interface MilestoneResult {
  name: string
  target: number
  description: string
  achieved: boolean
  progress: number // 0-100
}

export interface FireProgress {
  currentNetWorth: number
  annualExpenses: number
  milestones: MilestoneResult[]
  fireTarget: number
  overallProgress: number
  yearsToNextMilestone: number | null
}

export function calculateFireProgress(
  currentNetWorth: number,
  annualExpenses: number,
  annualSavings: number,
  expectedReturn: number = 0.07,
  safeWithdrawalRate: number = 0.04,
): FireProgress {
  const fireTarget = annualExpenses / safeWithdrawalRate

  // Define key milestones
  const milestones: MilestoneResult[] = [
    {
      name: 'Starter',
      target: 0,
      description: '开始积累',
      achieved: currentNetWorth >= 0,
      progress: 100,
    },
    {
      name: 'Emergency Fund',
      target: annualExpenses / 4, // 3 months expenses
      description: '应急基金 (3个月支出)',
      achieved: currentNetWorth >= annualExpenses / 4,
      progress: Math.min(
        100,
        Math.round((currentNetWorth / (annualExpenses / 4)) * 100),
      ),
    },
    {
      name: 'Half Year Freedom',
      target: annualExpenses / 2 / safeWithdrawalRate,
      description: '半年自由 (6个月被动收入)',
      achieved:
        currentNetWorth >= annualExpenses / 2 / safeWithdrawalRate,
      progress: Math.min(
        100,
        Math.round(
          (currentNetWorth / (annualExpenses / 2 / safeWithdrawalRate)) *
            100,
        ),
      ),
    },
    {
      name: 'Lean FIRE',
      target: (annualExpenses * 0.7) / safeWithdrawalRate,
      description: 'Lean FIRE (70%支出)',
      achieved:
        currentNetWorth >= (annualExpenses * 0.7) / safeWithdrawalRate,
      progress: Math.min(
        100,
        Math.round(
          (currentNetWorth / ((annualExpenses * 0.7) / safeWithdrawalRate)) *
            100,
        ),
      ),
    },
    {
      name: 'Full FIRE',
      target: fireTarget,
      description: '财务自由 (100%)',
      achieved: currentNetWorth >= fireTarget,
      progress: Math.min(
        100,
        Math.round((currentNetWorth / fireTarget) * 100),
      ),
    },
    {
      name: 'Fat FIRE',
      target: fireTarget * 1.5,
      description: 'Fat FIRE (150%)',
      achieved: currentNetWorth >= fireTarget * 1.5,
      progress: Math.min(
        100,
        Math.round((currentNetWorth / (fireTarget * 1.5)) * 100),
      ),
    },
  ]

  // Calculate years to next milestone
  let yearsToNextMilestone: number | null = null
  const nextMilestone = milestones.find((m) => !m.achieved)
  if (nextMilestone && annualSavings > 0) {
    const gap = nextMilestone.target - currentNetWorth
    if (gap > 0) {
      // Simplified calculation
      let balance = currentNetWorth
      let years = 0
      while (balance < nextMilestone.target && years < 100) {
        balance = balance * (1 + expectedReturn) + annualSavings
        years++
      }
      yearsToNextMilestone = years
    }
  }

  return {
    currentNetWorth,
    annualExpenses,
    milestones,
    fireTarget,
    overallProgress: Math.round((currentNetWorth / fireTarget) * 100),
    yearsToNextMilestone,
  }
}

// Example usage:
// calculateFireProgress(200000, 108000, 72000, 0.07, 0.04)
