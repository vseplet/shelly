# Shelly

Shelly is a module designed for executing commands in TypeScript. The code
exports a function called [shelly](./src/shelly.ts) which takes in two
arguments: a command as a string or an array of strings and an optional set of
options with default values.

---

## Usage:

```ts
import { shelly } from "https://deno.land/x/shelly@v0.1.1/mod.ts";

const res = await shelly("echo Hello, World!");
console.log(res.stdout);
// -> Hello, World
```

The shelly function uses the Deno runtime to execute the specified command and
captures the output in two separate variables for standard output (stdout) and
standard error (stderr). It also catches any errors thrown during the execution
process and stores them in an error variable.

## Contents

- [Shelly](#shelly)
  - [Usage:](#usage)
  - [Contents](#contents)
  - [Shell](#shell)
  - [SSH](#ssh)
  - [GIT](#git)

## Shell

To use Shelly for calling shells, you can use one of the provided shell-specific
functions: sh, zsh, bash, or fish. These functions accept a command string or an
array of command arguments and options, and then call the shelly function
internally with the appropriate shell command and arguments.

For example, to execute a simple command using the bash shell, you could use the
following code:

```ts
import { bash } from "https://deno.land/x/shelly@v0.1.1/mod.ts";

const res = await bash`sleep 10; echo Hello!`;
console.log(res);
// -> { stderr: "", stdout: "Hello!\n", error: null }
```

## SSH

todo...

## GIT

todo...
