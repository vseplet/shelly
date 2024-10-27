import { TimeoutExecutionError } from "$errors";
import { promiseWithTimeout } from "$helpers";
import type { ShellyOptions, ShellyResponse } from "$types";
import { defaultShellyOptions } from "$/constants.ts";

/**
 * Executes a command and returns the result
 * @param pureCommand - command to execute
 * @param options
 * @returns {Promise<ShellyResponse>} stdout, stderr and error
 */
export const shelly = async (
  pureCommand: string[] | string,
  options: ShellyOptions = defaultShellyOptions,
): Promise<ShellyResponse> => {
  let stdout = "";
  let stderr = "";
  let error: Error | null = null;
  let success: boolean = false;
  let code = 0;

  try {
    const command = typeof pureCommand === "object"
      ? pureCommand[0]
      : pureCommand;
    const args = typeof pureCommand === "object" ? pureCommand.slice(1) : [];

    const process = new Deno.Command(command, {
      args,
      stdout: "piped",
      stderr: "piped",
    }).spawn();

    const result = await promiseWithTimeout(
      process.output(),
      options.timeout,
    );

    if (result === null) process.kill();

    stdout = new TextDecoder().decode(result!.stdout);
    stderr = new TextDecoder().decode(result!.stderr);
    success = result!.success;
    code = result!.code;

    if (result === null) {
      throw new TimeoutExecutionError(
        "Process execution timeout!",
      );
    }
  } catch (e: unknown) {
    error = e as Error;
  }

  if (options.exception) {
    if (!success && stderr) {
      throw new Error(stderr);
    }

    if (error) {
      throw error;
    }
  }

  return {
    stderr,
    stdout,
    error,
    code,
    success,
  };
};
