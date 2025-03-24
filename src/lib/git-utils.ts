import { execSync } from 'child_process';


export function getChangedFiles(): string[] {
  try {
    const output = execSync('git diff --name-only HEAD', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'] // Ignore stderr
    });
    return output
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(path => path.trim());
  } catch (error) {
    console.error('Error getting changed files:', error);
    return [];
  }
}

export function getFileDiff(filePath: string): string {
  try {
    // Manually escape the path by wrapping in single quotes
    const escapedPath = `'${filePath.replace(/'/g, "'\\''")}'`;
    return execSync(`git diff HEAD -- ${escapedPath}`, {
      encoding: 'utf-8'
    });
  } catch (error) {
    console.error(`Error getting diff for ${filePath}:`, error);
    return '';
  }
}