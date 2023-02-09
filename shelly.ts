import { sleep } from "https://deno.land/x/sleep/mod.ts";

interface IShellResponse {
  data: {
    stdout: string;
    stderr: string;
  };
  error: Error | null;
}
async function shelly(command: string, timeout = 4): Promise<IShellResponse> {
  try {
    const splitted = command.split(" ");

    const p = Deno.run({ cmd: splitted, stdout: "piped", stderr: "piped" });
    const processFinite = await Promise.any([
      p.status(),
      sleep(timeout),
    ]);
    if (processFinite) {
      const [{ code }, out, err] = await Promise.all([
        processFinite as Deno.ProcessStatus,
        p.output(),
        p.stderrOutput(),
      ]);
      if (code === 0) {
        return {
          data: { stdout: new TextDecoder().decode(out), stderr: "" },
          error: null,
        };
      } else {
        return {
          data: { stdout: "", stderr: new TextDecoder().decode(err) },
          error: null,
        };
      }
    } else {
      p.kill();
      const out = new TextDecoder().decode(await p.output());
      const err = new TextDecoder().decode(await p.stderrOutput());
      p.close();
      return {
        data: { stdout: out, stderr: err },
        error: new Error("Процесс занятулся"),
      };
    }
  } catch (e) {
    return { data: { stdout: "", stderr: "" }, error: (e as Error) };
  }
}

{
  const { data, error } = await shelly("./sleepAndEcho.sh", 5);
  console.log(data);
  console.log(error);
  console.log("--------------------------------");
}
