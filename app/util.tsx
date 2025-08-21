export const timeoutPromise = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data loaded successfully");
    }, duration);
  });
};

export function midnightUTC(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export function midnightUTCstring(date: Date): string {
  return midnightUTC(date).toLocaleDateString();
}

// "snap" percentage to the closest step by rounding it to the nearest quarter (25%).
// 0.13 → 0.2
// 0.61 → 0.6
const MAX_SIZE = 5;
const STEP = 0.2; // 20%
export function getSnappedPercentage(n: number) {
  if (n === 0) return 0;
  const raw = Math.min(n, MAX_SIZE) / MAX_SIZE;
  const percentage = Math.round(raw / STEP) * STEP;
  return percentage;
}
