import { sleep } from 'https://deno.land/x/sleep/mod.ts';

interface IShellResponse {
  data: {
    stdout: string;
    stderr: string;
  };
  error: Error | null;
}

interface IShellyOptions {
  timeout: number;
}

/**
 * Выполняет @command, если выполнение займет дольше @timeout, вернет Error.
 * В случае успеха вернет объект с stdout и stderr
 * @param command Строка с командой
 * @param timeout Время в секундах
 * @returns Объект с stdout и stderr
 */
async function shelly(
  command: string,
  options: IShellyOptions = { timeout: 4 },
): Promise<IShellResponse> {
  try {
    const splitted = command.split(' ');
    const proc = Deno.run({ cmd: splitted, stdout: 'piped', stderr: 'piped' });
    let timeoutId = 0;
    const sleeper = new Promise((resolve) =>
      timeoutId = setTimeout(resolve, options.timeout * 1000)
    );
    //TODO(artpani) вынести механизм контроля длительности промиса в отдельную функию

    const finiteProc: Deno.ProcessStatus | unknown = await Promise.any([
      proc.status(),
      sleeper,
    ]);

    if (finiteProc as Deno.ProcessStatus) {
      clearTimeout(timeoutId);
      const out = new TextDecoder().decode(await proc.output());
      const err = new TextDecoder().decode(await proc.stderrOutput());
      const { success, code } = finiteProc as Deno.ProcessStatus;
      if (success) {
        return {
          data: { stdout: out, stderr: '' },
          error: null,
        };
      } else {
        return {
          data: { stdout: out, stderr: err },
          error: new Error(JSON.stringify(finiteProc)),
        };
      }
    } else {
      proc.kill();
      proc.close();
      const out = new TextDecoder().decode(await proc.output());
      const err = new TextDecoder().decode(await proc.stderrOutput());
      return {
        data: { stdout: out, stderr: err },
        error: new Error('Процесс занятулся'),
      };
    }
  } catch (e) {
    return { data: { stdout: '', stderr: '' }, error: (e as Error) };
  }
}

{
  const { data, error } = await shelly(`./sleepAndEcho.sh`, {
    timeout: 3,
  });

  // console.log(data);
  // console.log(error);
  // console.log('--------------------------------');
}
