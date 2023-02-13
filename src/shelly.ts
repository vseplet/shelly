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
  shell?: 'zsh' | 'bash' | 'sh' | 'powershell' | 'cmd' | 'pwsh';
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
    const cmdArray = options.shell
      ? [options.shell, '-c', command]
      : command.split(' ');
    const proc = Deno.run({
      cmd: cmdArray,
      stdout: 'piped',
      stderr: 'piped',
    });
    let out: string;
    let err: string;
    let error: any;
    const finiteProc = timeoutAsync(
      () => proc.status(),
      options.timeout,
    );
    finiteProc.then(() => {
      error = null;
    }).catch((e) => { //Таймер сработал раньше, чем процесс
      proc.kill();
      error = new Error(e);
    });

    out = new TextDecoder().decode(await proc.output());
    err = new TextDecoder().decode(await proc.stderrOutput());
    await proc.close();
    return { data: { stdout: out, stderr: err }, error: error };
  } catch (e) {
    throw new Error(e); //TODO: Переделать на нормальный Error
  }
}
// try {
//   const { data, error } = await shelly(
//     './scripts/sleepAndEcho.sh',
//     {
//       timeout: 8,
//       shell: 'zsh',
//     },
//   );
//   console.log(`Данные: ${data.stdout}, ошибка: ${data.stderr}`);
//   console.log(error ? `Критическая ошибка: ${error}` : 'Ошибок нет');
// } catch (e) {
//   console.log('КОКОЙ-ТО НЕПОРЯДОК! ', e);
// }

try {
  const { data, error } = await shelly(
    'sleep 4; echo \'ну и?\'',
    {
      timeout: 8,
      shell: 'zsh',
    },
  );
  console.log(`Данные: ${data.stdout}, ошибка: ${data.stderr}`);
  console.log(error ? `Критическая ошибка: ${error}` : 'Ошибок нет');
} catch (e) {
  console.log('КОКОЙ-ТО НЕПОРЯДОК! ', e);
}
