export const timeoutPromise = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data loaded successfully");
    }, duration);
  });
};

// "snap" percentage to the closest step by rounding it to the nearest quarter (25%).
// 0.13 → 0.2
// 0.61 → 0.6
const MAX_SIZE = 5;
const STEP = 0.2; // 20%
export function getSnappedPercentage(n: number, max = MAX_SIZE) {
  if (n === 0) return 0;
  const raw = Math.min(n, max) / max;
  const percentage = Math.round(raw / STEP) * STEP;
  return percentage;
}

export function getPercentage(n: number, total: number) {
  if (n === 0) return 0;
  return Number((n / total).toFixed(2));
}
