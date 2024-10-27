/**
 * Executes a promise with a timeout and returns the result
 * @param {Promise<T>} promise
 * @param {number} timeout
 * @returns {Promise<T | null>} result or null if timeout
 */
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
