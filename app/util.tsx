export const timeoutPromise = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data loaded successfully");
    }, duration);
  });
};
