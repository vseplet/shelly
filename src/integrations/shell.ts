import { defaultShellyOps, IShellyOps, shelly } from "../shelly.ts";

export const sh = async function (
  _commands: TemplateStringsArray | string,
  _options: IShellyOps = defaultShellyOps,
) {
  const cmd = typeof _commands === "object" ? _commands.join(" ") : _commands;

  return await shelly(["sh", "-c", cmd], _options);
};

export const zsh = async function (
  _commands: TemplateStringsArray | string,
  _options: IShellyOps = defaultShellyOps,
) {
  const cmd = typeof _commands === "object" ? _commands.join(" ") : _commands;

  return await shelly(["sh", "-c", cmd], _options);
};

export const bash = async function (
  _commands: TemplateStringsArray | string,
  _options: IShellyOps = defaultShellyOps,
) {
  const cmd = typeof _commands === "object" ? _commands.join(" ") : _commands;

  return await shelly(["sh", "-c", cmd], _options);
};

export const fish = async function (
  _commands: string,
  _options: IShellyOps = defaultShellyOps,
) {};
