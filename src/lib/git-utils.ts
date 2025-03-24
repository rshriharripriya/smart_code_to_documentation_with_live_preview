import { execSync } from 'child_process';

export function getChangedFiles(): string[] {
  return execSync('git diff --name-only HEAD', { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .filter(Boolean);
}

export function getFileDiff(filePath: string): string {
  return execSync(`git diff HEAD -- ${filePath}`, { encoding: 'utf-8' });
}