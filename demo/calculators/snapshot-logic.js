// 快照算法纯函数（与 localStorage / DOM 解耦，可测试）

export function upsertSnapshot(snapshots, snap) {
  const date = snap.date || new Date().toISOString().slice(0, 7);
  const merged = { ...snap, date };
  const idx = snapshots.findIndex(s => s.date === date);
  const next = snapshots.slice();
  if (idx >= 0) next[idx] = merged;
  else next.push(merged);
  next.sort((a, b) => a.date.localeCompare(b.date));
  return next;
}

export function trendDirection(curr, prev, higherBetter = true) {
  if (prev == null) return 'none';
  if (curr === prev) return 'flat';
  const better = higherBetter ? curr > prev : curr < prev;
  return better ? 'up' : 'down';
}

export function snapshotDelta(snapshots, field = 'netAssets') {
  if (snapshots.length < 2) return null;
  const oldest = snapshots[0][field];
  const latest = snapshots[snapshots.length - 1][field];
  return { delta: latest - oldest, oldest, latest, count: snapshots.length };
}

// CSV 序列化：每月一行
export function snapshotsToCSV(snapshots) {
  if (!snapshots || snapshots.length === 0) return '';
  const headers = ['date', 'netAssets', 'investableAssets', 'progressPct', 'savingsRate', 'fireTarget', 'yearsToFI', 'annualIncome', 'annualSavings'];
  const rows = snapshots.map(s => headers.map(h => {
    const v = s[h];
    return v === null || v === undefined ? '' : String(v);
  }).join(','));
  return [headers.join(','), ...rows].join('\n');
}
