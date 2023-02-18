import { defaultShellyOps, IShellyOps, shelly } from '../shelly.ts';
// interface IGitOps extends IShellyOps {
//   directory?: TemplateStringsArray | string;
//   filePattern?: TemplateStringsArray | string;
//   message?: TemplateStringsArray | string;
//   branch?: TemplateStringsArray | string;
//   url?: TemplateStringsArray | string;
// }

export const defaultDirectory = './';
export const defaultFilePattern = '.';

export async function gitInit(
  directory: TemplateStringsArray | string = defaultDirectory,
) {
  return await shelly(`git -C ${directory} init`);
}

export async function gitAdd(
  directory: TemplateStringsArray | string,
  filePattern: string = defaultFilePattern,
) {
  return await shelly(`git -C ${directory} add ${filePattern}`);
}

export async function gitCommit(
  directory: string = defaultDirectory,
  message: string,
) {
  console.log(`git -C ${directory} commit -m \"${message}\"`);
  return await shelly([
    'git',
    '-C',
    directory,
    'commit',
    '-m',
    message,
  ]);
}

export async function gitPush(
  directory: TemplateStringsArray | string = defaultDirectory,
  branch: string,
) {
  return await shelly(`git -C ${directory} push -u origin ${branch}`);
}

export async function gitPull(
  directory: TemplateStringsArray | string = defaultDirectory,
) {
  return await shelly(`git -C ${directory} pull`);
}

export async function gitClone(
  url: string,
  directory: TemplateStringsArray | string = defaultDirectory,
) {
  return await shelly(`git clone ${url} ${directory}`);
}
export async function gitReset(
  directory: TemplateStringsArray | string,
) {
  return await shelly(`git -C ${directory} reset HEAD~1`);
}
export async function gitCheckout(
  directory: TemplateStringsArray | string = defaultDirectory,
  branch: string,
) {
  return await shelly(`git -C ${directory} checkout ${branch}`);
}

export async function gitStatus(
  directory: TemplateStringsArray | string = defaultDirectory,
) {
  return await shelly(`git -C ${directory} status`);
}

// console.log(await gitStatus`/Users/artpani/projects/Matey`);
console.log(await gitAdd`/Users/artpani/projects/Matey`);
console.log(
  await gitCommit(
    '/Users/artpani/projects/Matey',
    'From shelly commited 3',
  ),
);
console.log(
  await gitPush(`/Users/artpani/projects/Matey`, 'matey_1'),
);

// console.log(await gitReset`/Users/artpani/projects/Matey`);
