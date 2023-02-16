import { promiseWithTimeout } from './helpers/timeoitAsync.ts';

export class TimeoutExecutionError extends Error {
}

export interface IShellyOps {
  timeout: number;
}

export interface IShellyRes {
  stdout: string;
  stderr: string;
  error: Error | null;
}

export const defaultShellyOps: IShellyOps = {
  timeout: 15,
};

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

// example
// console.log(
//   await shelly(`../scripts/sleepAndEcho.sh`, { timeout: 3 }),
// );
