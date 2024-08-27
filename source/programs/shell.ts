import { shelly } from "$/shelly.ts";
import type { ShellyOptions } from "$types";
import { defaultShellyOptions } from "$/constants.ts";

export const sh = async function (
  commands: TemplateStringsArray | string,
  options: ShellyOptions = defaultShellyOptions,
) {
  const cmd = typeof commands === "object" ? commands.join(" ") : commands;

  return await shelly(["sh", "-c", cmd], options);
};

export const zsh = async function (
  commands: TemplateStringsArray | string,
  options: ShellyOptions = defaultShellyOptions,
) {
  const cmd = typeof commands === "object" ? commands.join(" ") : commands;

  return await shelly(["zsh", "-c", cmd], options);
};

export const bash = async function (
  commands: TemplateStringsArray | string,
  options: ShellyOptions = defaultShellyOptions,
) {
  const cmd = typeof commands === "object" ? commands.join(" ") : commands;

  return await shelly(["bash", "-c", cmd], options);
};

export const fish = async function (
  commands: string,
  options: ShellyOptions = defaultShellyOptions,
) {};
