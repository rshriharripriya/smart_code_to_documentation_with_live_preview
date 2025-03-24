import { NextResponse } from 'next/server';
import { getChangedFiles } from '@/lib/git-utils';
import { analyzeCodeChanges } from '@/lib/code-analyzer';
import { generateChangeDocumentation } from '@/lib/doc-generator';
import { captureComponentScreenshot } from '@/lib/screenshot-service';

export async function GET() {
  try {
    console.log('Starting documentation generation...');
    const changedFiles = getChangedFiles().filter(f => /\.(js|jsx|ts|tsx)$/.test(f));
    console.log('Changed files:', changedFiles);

    let markdown = '# Smart Documentation\n\n';

    for (const file of changedFiles) {
      console.log('Processing file:', file);
      const changes = analyzeCodeChanges(file);
      console.log('Changes found:', changes.length);

      markdown += `## ${file}\n`;

      for (const change of changes) {
        console.log('Generating docs for change:', change.name);
        const docs = await generateChangeDocumentation(change);
        console.log('Generated docs:', docs.substring(0, 50) + '...'); // Log first 50 chars

        markdown += `### ${change.name}\n${docs}\n`;

        if (change.type === 'component') {
          console.log('Capturing screenshot for component:', change.name);
          const screenshotPath = await captureComponentScreenshot(change.name);
          if (screenshotPath) {
            markdown += `![${change.name} screenshot](${screenshotPath.replace('public/', '')})\n`;
          }
        }
      }
    }

    console.log('Finished generating documentation');
    return new NextResponse(markdown);
  } catch (error) {
    console.error('Documentation generation failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Generation failed', details: errorMessage },
      { status: 500 }
    );
  }
}