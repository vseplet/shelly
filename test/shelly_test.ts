import { assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { bash, shellyOld, zsh } from '../source/shelly.ts';

Deno.test('shelly - run command and returns stdout', async () => {
  const result = await shellyOld('echo hello world');
  assertEquals(result.data.stdout.trim(), 'hello world');
});

// Deno.test('shelly - returns Error when command execution takes longer than timeout', async () => {
//   const result = await shelly('sleep 10', { timeout: 1 });
//   assertEquals(result.error instanceof Error, true);
// });

// Deno.test('bash - executes command with bash shell and returns stdout and stderr', async () => {
//   const result = await bash('echo hello world');
//   assertEquals(result.data.stdout.trim(), 'hello world');
// });

// Deno.test('zsh - executes command with zsh shell and returns stdout and stderr', async () => {
//   const result = await zsh('echo hello world');
//   assertEquals(result.data.stdout.trim(), 'hello world');
// });
