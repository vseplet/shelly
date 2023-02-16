import { promiseWithTimeout } from './helpers/timeoitAsync.ts';

class TimeoutExecutionError extends Error {
}

interface IShellyOps {
  timeout: number;
}

interface IShellyRes {
  stdout: string;
  stderr: string;
  error: Error | null;
}

const defaultShellyOps: IShellyOps = {
  timeout: 15,
};

export const shelly = async (
  command: string,
  options: IShellyOps = defaultShellyOps,
): Promise<IShellyRes> => {
  let stdout: string = '';
  let stderr: string = '';
  let error: Error | null = null;

  try {
    const proc = Deno.run({
      cmd: command.split(' '),
      stdout: 'piped',
      stderr: 'piped',
    });

    const result = await promiseWithTimeout(
      proc.status(),
      options.timeout,
    );

    proc.kill();

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
