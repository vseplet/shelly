export type TimeoutAsync<T> = T | string;

/**
 * Options for the shelly function
 * @property {number} timeout - timeout in seconds
 */
export type ShellyOptions = {
  timeout?: number;
  exception?: boolean;
  input?: Uint8Array | string;
};

export type DefaultShellyOptions = {
  timeout: number;
  exception: boolean;
};

/**
 * Result of the shelly function
 * @property {string} stdout - stdout of the command
 * @property {string} stderr - stderr of the command
 * @property {Error | null} error - error if any
 */
export type ShellyResponse = {
  stdout: string;
  stderr: string;
  code: number;
  success: boolean;
  error: Error | null;
};
