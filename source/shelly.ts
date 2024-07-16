import { TimeoutExecutionError } from './errors.ts';
import { promiseWithTimeout } from './helpers/timeout.ts';
/**
 * Options for the shelly function
 * @property {number} timeout - timeout in seconds
 */
export interface IShellyOps {
  timeout: number;
}

/**
 * Result of the shelly function
 * @property {string} stdout - stdout of the command
 * @property {string} stderr - stderr of the command
 * @property {Error | null} error - error if any
 */
export interface IShellyRes {
  stdout: string;
  stderr: string;
  error: Error | null;
}

export const defaultShellyOps: IShellyOps = {
  timeout: 15,
};

/**
 * Executes a command and returns the result
 * @param command - command to execute
 * @param options
 * @returns {Promise<IShellyRes>} stdout, stderr and error
 */
export const shelly = async (
  command: string[] | string,
  options: IShellyOps = defaultShellyOps,
): Promise<IShellyRes> => {
  let stdout = '';
  let stderr = '';
  let error: Error | null = null;

  try {
    const proc = Deno.run({
      cmd: typeof command === 'object' ? command : command.split(' '),
      stdout: 'piped',
      stderr: 'piped',
    });

    const result = await promiseWithTimeout(
      proc.status(),
      options.timeout,
    );

    if (result === null) proc.kill();

    stdout = new TextDecoder().decode(
      await proc.output(),
    );

    stderr = new TextDecoder().decode(
      await proc.stderrOutput(),
    );

    proc.close();

    if (result === null) {
      throw new TimeoutExecutionError(
        'Process execution timeout!',
      );
    }
  } catch (e) {
    error = e as Error;
  }

  return {
    stderr,
    stdout,
    error,
  };
};
