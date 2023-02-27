export type TtimeoutAsync<T> = T | string;

export async function promiseWithTimeout<T>(
  promise: Promise<T>,
  timeout: number,
): Promise<T | null> {
  let timeoutId = undefined;

  try {
    const timeoutPromise = new Promise<T | null>((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(null);
      }, timeout * 1000);
    });

    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);

    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
