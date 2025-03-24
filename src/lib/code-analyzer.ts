import ts from 'typescript';
import { getFileDiff } from './git-utils';
import { CodeChange } from './types';
import fs from 'fs';

export function analyzeCodeChanges(filePath: string): CodeChange[] {
  const diff = getFileDiff(filePath);
  console.log(diff);
  const changes: CodeChange[] = [];

  if (!diff.trim()) {
    console.log('No diff found for file:', filePath);
    return changes;
  }

  try {
    // Read file using Node.js fs instead of ts.sys for better reliability
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      fileContent,
      ts.ScriptTarget.Latest,
      true
    );

    // Parse changed lines from diff
    const changedLines = parseChangedLines(diff);
    console.log('Changed lines for', filePath, ':', changedLines);

    ts.forEachChild(sourceFile, (node) => {
      const nodeStart = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      const nodeEnd = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
      const nodeLineStart = nodeStart.line + 1; // Convert to 1-based
      const nodeLineEnd = nodeEnd.line + 1;

      // Check if any changed line falls within this node's range
      const hasChanges = Array.from(changedLines).some(line =>
        line >= nodeLineStart && line <= nodeLineEnd
      );

      if (hasChanges) {
        if (ts.isFunctionDeclaration(node) && node.name) {
          changes.push({
            name: node.name.text,
            type: 'function',
            code: node.getText(sourceFile),
            filePath
          });
        }

        if (ts.isVariableStatement(node)) {
          node.declarationList.declarations.forEach(decl => {
            if (ts.isIdentifier(decl.name) && /^[A-Z]/.test(decl.name.text)) {
              changes.push({
                name: decl.name.text,
                type: 'component',
                code: node.getText(sourceFile),
                filePath
              });
            }
          });
        }
      }
    });

  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error);
  }

  console.log('Final changes detected:', changes);
  return changes;
}

// Helper function to properly parse git diff line numbers
function parseChangedLines(diff: string): Set<number> {
  const changedLines = new Set<number>();
  const lines = diff.split('\n');
  let currentLineNumber = 0;
  let inHunk = false;

  for (const line of lines) {
    if (line.startsWith('@@')) {
      // Example: @@ -1,5 +1,6 @@
      const match = line.match(/\+(\d+)(?:,(\d+))?/);
      if (match) {
        currentLineNumber = parseInt(match[1]);
        inHunk = true;
      }
      continue;
    }

    if (inHunk) {
      if (line.startsWith('+') && !line.startsWith('++')) {
        changedLines.add(currentLineNumber);
        currentLineNumber++;
      } else if (line.startsWith(' ')) {
        currentLineNumber++;
      }
      // Skip deletion lines (-)
    }
  }

  return changedLines;
}