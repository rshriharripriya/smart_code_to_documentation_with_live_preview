import ts from 'typescript';
import { getFileDiff } from './git-utils';
import { CodeChange } from './types'; // Fixed import

export function analyzeCodeChanges(filePath: string): CodeChange[] {
  const diff = getFileDiff(filePath);
  const sourceFile = ts.createSourceFile(
    filePath,
    diff,
    ts.ScriptTarget.Latest,
    true
  );

  const changes: CodeChange[] = [];

  ts.forEachChild(sourceFile, (node) => {
    // Detect functions
    if (ts.isFunctionDeclaration(node) && node.name) {
      changes.push({
        name: node.name.text,
        type: 'function',
        code: node.getText(sourceFile),
        filePath
      });
    }

    // Detect React components (simplified)
    if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach(decl => {
        if (ts.isIdentifier(decl.name) && /^[A-Z]/.test(decl.name.text)) {
          changes.push({
            name: decl.name.text,
            type: 'component',
            code: decl.getText(sourceFile),
            filePath
          });
        }
      });
    }
  });

  return changes;
}