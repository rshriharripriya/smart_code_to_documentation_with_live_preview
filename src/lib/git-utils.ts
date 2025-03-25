import { execSync } from 'child_process';


export function getChangedFiles(): string[] {
  try {
    const output = execSync('git show --name-only --pretty=format: HEAD', {
      encoding: 'utf-8'
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
    return execSync(`git show HEAD -- ${escapedPath}`, {
      encoding: 'utf-8'
    });
  } catch (error) {
    console.error(`Error getting diff for ${filePath}:`, error);
    return '';
  }
}