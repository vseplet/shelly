export type TtimeoutAsync<T> = T | string;

export async function timeoutAsync<T>(
  asyncFn: () => Promise<T>,
  timeout: number,
): Promise<TtimeoutAsync<T>> {
  let timeoutId = 0;
  const promise = asyncFn();

  let promiseOfResult = Promise.race<Promise<T> | Promise<string>>([
    promise,
    new Promise<string>((_, reject) => {
      timeoutId = setTimeout(
        reject,
        timeout * 1000,
        new Error('Too long!'),
      );
    }),
  ]).finally(() => clearTimeout(timeoutId));

  return promiseOfResult;
}

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
