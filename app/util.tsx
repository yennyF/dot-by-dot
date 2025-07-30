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
