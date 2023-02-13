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
  // .finally(() => clearTimeout(timeoutId));
  return promiseOfResult;
}

// async function f(n: number) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve('Я испольнился внутри f');
//     }, n * 1000);
//   });
// }
// const splitted = `scripts/sleepAndEcho.sh`.split(' ');
// const proc = Deno.run({
//   cmd: splitted,
//   stdout: 'piped',
//   stderr: 'piped',
// });

// const finiteProc = timeoutAsync(async () => proc.status(), 2);
// try {
//   const result = finiteProc.then(async (processStatus) => {
//     const { success } = processStatus as Deno.ProcessStatus;
//     const out = new TextDecoder().decode(await proc.output());
//     if (success) {
//       return out;
//     } else {
//       const err = new TextDecoder().decode(await proc.stderrOutput());
//       throw new Error(err);
//     }
//   }).catch((e) => {
//     proc.kill();
//     console.log('ДАрова!! Псина в ловушке ');
//     return e;
//   });
// } catch (e) {
//   console.log('Дароу  в catch');
// }

// const splitted = `scripts/sleepAndEcho.sh`.split(' ');
// const proc = Deno.run({
//   cmd: splitted,
//   stdout: 'piped',
//   stderr: 'piped',
// });

// const finiteProc = timeoutAsync(async () => proc.status(), 2);
// try {
//   const result = await finiteProc;
//   const { success } = result as Deno.ProcessStatus;
//   const out = new TextDecoder().decode(await proc.output());
//   if (success) {
//     console.log(out);
//   } else {
//     const err = new TextDecoder().decode(await proc.stderrOutput());
//     throw new Error(err);
//   }
// } catch (e: any) {
//   proc.kill();
//   console.log('ДАрова!! Псина в ловушке ');
//   console.log(e);
// }
