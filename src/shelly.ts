import { sleep } from 'https://deno.land/x/sleep/mod.ts';
import { timeoutAsync } from '../tools/timers/control.ts';
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
    const proc = Deno.run({
      cmd: splitted,
      stdout: 'piped',
      stderr: 'piped',
    });
    let out: string;
    let err: string;
    const finiteProc = timeoutAsync(
      () => proc.status(),
      options.timeout,
    );

    let error: any;
    finiteProc.then(() => {
      error = null;
    }).catch((e) => { //Таймер сработал раньше, чем процесс
      proc.kill();
      error = new Error(e);
    });
    out = new TextDecoder().decode(await proc.output());
    err = new TextDecoder().decode(await proc.stderrOutput());
    return { data: { stdout: out, stderr: err }, error: error };
  } catch (e) {
    throw new Error(e); //TODO: Переделать на нормальный Error
  }
}

try {
  const { data, error } = await shelly(`scripts/sleepAndEcho.sh`, {
    timeout: 1,
  });
  console.log(`Данные: ${data.stdout}, ошибка: ${data.stderr}`);
  console.log(`Критическая ошибка: ${error}`);
} catch (e) {
  console.log('КОКОЙ-ТО НЕПОРЯДОК! ', e);
}
