import { sh } from "$/programs/shell.ts";

export const cmd = async (
  commands: TemplateStringsArray | string,
  timeout: number = 1000,
): Promise<string> => {
  const res = await sh(commands, {
    timeout,
    exception: true,
  });

  return res.stdout;
};
