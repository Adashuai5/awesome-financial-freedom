(function attachFireCalculationCore(globalScope) {
  function clampNonNegative(value) {
    return Math.max(0, value);
  }

  function normalizeRate(value) {
    if (!Number.isFinite(value)) {
      return 0;
    }
    return value > 1 ? value / 100 : value;
  }

  function calculateYearsToFI(investableAssets, fireTarget, expectedReturnRate, annualSavings) {
    if (investableAssets >= fireTarget) {
      return 0;
    }

    const maxYears = 100;
    let years = 0;
    let balance = investableAssets;

    while (balance < fireTarget && years < maxYears) {
      balance = balance * (1 + expectedReturnRate) + annualSavings;
      years += 1;

      if (!Number.isFinite(balance) || balance < 0) {
        return null;
      }
    }

    return years >= maxYears ? null : years;
  }

  function calculateCoreMetrics(input) {
    const safeWithdrawalRate = input.safeWithdrawalRate ?? 0.04;
    const expectedReturnRate = normalizeRate(input.expectedReturnRate ?? 0);
    const annualExpenses = clampNonNegative(input.annualExpenses ?? 0);
    const annualSavings = input.annualSavings ?? 0;
    const monthlyPassiveIncome = clampNonNegative(input.monthlyPassiveIncome ?? 0);
    const annualPassiveIncome = monthlyPassiveIncome * 12;
    const adjustedAnnualExpenses = clampNonNegative(annualExpenses - annualPassiveIncome);
    const totalAssets = input.totalAssets ?? 0;
    const totalLiabilities = input.totalLiabilities ?? 0;
    const netAssets = totalAssets - totalLiabilities;
    const primaryResidenceValue = clampNonNegative(input.primaryResidenceValue ?? 0);
    const emergencyFundMonths = input.emergencyFundMonths ?? 6;
    const monthlyExpenses = annualExpenses / 12;
    const emergencyFundTarget = monthlyExpenses * emergencyFundMonths;
    const fireTarget = safeWithdrawalRate > 0 ? adjustedAnnualExpenses / safeWithdrawalRate : 0;

    const investableAssetsRaw = input.investableAssets ?? (netAssets - primaryResidenceValue);
    const investableAssets = clampNonNegative(investableAssetsRaw);
    const annualGrowth = investableAssets * expectedReturnRate + annualSavings;
    const yearsToFI = calculateYearsToFI(investableAssets, fireTarget, expectedReturnRate, annualSavings);
    const progressPct = fireTarget > 0 ? Math.min(100, Math.round((investableAssets / fireTarget) * 100)) : 0;

    return {
      netAssets,
      investableAssets,
      annualGrowth,
      emergencyFundTarget,
      fireTarget,
      yearsToFI,
      progressPct,
      expectedReturnRate,
      annualPassiveIncome,
      adjustedAnnualExpenses,
    };
  }

  function calculateRequiredAnnualSavingsForTargetYears(input) {
    const investableAssets = clampNonNegative(input.investableAssets ?? 0);
    const fireTarget = clampNonNegative(input.fireTarget ?? 0);
    const expectedReturnRate = normalizeRate(input.expectedReturnRate ?? 0);
    const targetYears = Math.floor(input.targetYears ?? 0);

    if (targetYears <= 0) {
      return null;
    }

    if (investableAssets >= fireTarget) {
      return 0;
    }

    if (expectedReturnRate === 0) {
      return Math.max(0, (fireTarget - investableAssets) / targetYears);
    }

    const growthFactor = Math.pow(1 + expectedReturnRate, targetYears);
    const annuityFactor = (growthFactor - 1) / expectedReturnRate;
    if (annuityFactor <= 0 || !Number.isFinite(annuityFactor)) {
      return null;
    }

    const needed = (fireTarget - investableAssets * growthFactor) / annuityFactor;
    if (!Number.isFinite(needed)) {
      return null;
    }

    return Math.max(0, needed);
  }

  globalScope.FireCalculationCore = {
    calculateCoreMetrics,
    calculateRequiredAnnualSavingsForTargetYears,
  };
})(window);
