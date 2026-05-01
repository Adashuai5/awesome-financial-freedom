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
    if (investableAssets >= fireTarget) return 0;

    if (expectedReturnRate === 0) {
      if (annualSavings <= 0) return null;
      const n = (fireTarget - investableAssets) / annualSavings;
      return n > 100 ? null : Math.ceil(n);
    }

    // Closed-form: P*(1+r)^n + S*((1+r)^n - 1)/r = T
    // → n = ln((T + S/r) / (P + S/r)) / ln(1+r)
    const r = expectedReturnRate;
    const denom = investableAssets + annualSavings / r;
    const numer = fireTarget + annualSavings / r;
    if (denom <= 0 || numer / denom <= 0) return null;

    const years = Math.log(numer / denom) / Math.log(1 + r);
    if (!Number.isFinite(years) || years <= 0 || years > 100) return null;

    return Math.ceil(years);
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
