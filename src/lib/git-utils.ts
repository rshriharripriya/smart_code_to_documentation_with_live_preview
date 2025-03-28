import { execSync } from 'child_process';

export function getChangedFiles(): string[] {
  try {
    // Method that works in both local and Vercel environments
    const output = execSync('git log -1 --name-only --pretty=format:', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore']
    });

    const files = output
      .trim()
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(path => path.trim());

    // Explicitly ensure we return an array
    return Array.isArray(files) ? files : [];

  } catch (error) {
    console.error('Error getting changed files:', error);
    return []; // Always return an array even on error
  }
}

export function getFileDiff(filePath: string): string {
  try {
    // Fallback method for Vercel
    if (process.env.VERCEL) {
      // In Vercel, we can use the provided environment variables
      const commitSha = process.env.VERCEL_GIT_COMMIT_SHA;
      if (!commitSha) return '';

      return execSync(`git show ${commitSha} -- ${filePath}`, {
        encoding: 'utf-8'
      });
    }

    // Local development method
    const escapedPath = `'${filePath.replace(/'/g, "'\\''")}'`;
    return execSync(`git show HEAD -- ${escapedPath}`, {
      encoding: 'utf-8'
    });
  } catch (error) {
    console.error(`Error getting diff for ${filePath}:`, error);
    return '';
  }
}