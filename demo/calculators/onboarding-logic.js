// 阶段诊断纯函数（可测试，与 DOM 解耦）
export const STAGE_KEYS = ['debt', 'emergency', 'start', 'savings', 'optimize', 'sprint'];

export function determineStage(answers) {
  if (answers[0] === 'yes') return 'debt';
  if (answers[1] === 'no') return 'emergency';
  if (answers[2] === 'no') return 'start';
  if (answers[3] === 'no') return 'savings';
  if (answers[4] === 'yes') return 'sprint';
  return 'optimize';
}

export function isTerminal(answers) {
  if (answers.length === 0) return false;
  if (answers[0] === 'yes') return true;
  if (answers.length >= 2 && answers[1] === 'no') return true;
  if (answers.length >= 3 && answers[2] === 'no') return true;
  if (answers.length >= 4 && answers[3] === 'no') return true;
  if (answers.length === 5) return true;
  return false;
}
