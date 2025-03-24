import { NextResponse } from 'next/server';
import { getChangedFiles } from '@/lib/git-utils';
import { analyzeCodeChanges } from '@/lib/code-analyzer';
import { generateChangeDocumentation } from '@/lib/doc-generator';
import { captureComponentScreenshot } from '@/lib/screenshot-service';

export async function GET() {
  try {
    const changedFiles = getChangedFiles().filter(f => /\.(js|jsx|ts|tsx)$/.test(f));
    let markdown = '# Smart Documentation\n\n';

    for (const file of changedFiles) {
      const changes = analyzeCodeChanges(file);
      markdown += `## ${file}\n`;

      for (const change of changes) {
        const docs = await generateChangeDocumentation(change);
        markdown += `### ${change.name}\n${docs}\n`;

        if (change.type === 'component') {
          const screenshotPath = await captureComponentScreenshot(change.name);
          if (screenshotPath) {
            markdown += `![${change.name} screenshot](${screenshotPath.replace('public/', '')})\n`;
          }
        }
      }
    }

    return new NextResponse(markdown);
  } catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  return NextResponse.json(
    { error: 'Generation failed', details: errorMessage },
    { status: 500 }
  );
}
}