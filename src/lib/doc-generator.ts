import { Groq } from 'groq-sdk';
import { CodeChange } from './types';

// Simple cache implementation
const docCache = new Map<string, string>();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

interface DocumentationOptions {
  technicalDepth?: 'basic' | 'detailed';
  includeExamples?: boolean;
}

export async function generateChangeDocumentation(
  change: CodeChange,
  options: DocumentationOptions = { technicalDepth: 'detailed', includeExamples: true }
): Promise<string> {
  const cacheKey = `${change.filePath}:${change.name}:${options.technicalDepth}`;

  // Return cached result if available
  if (docCache.has(cacheKey)) {
    return docCache.get(cacheKey)!;
  }

  try {
    const response = await groq.chat.completions.create({
      messages: [{
        role: 'user',
        content: `Generate comprehensive documentation in Markdown format for this ${change.type} with no emojis:

        ### File: ${change.filePath}
        ### Component/Function: ${change.name}

        ##  Purpose
        [1-2 sentence description of functionality]

        ##  ${change.type === 'component' ? 'Props' : 'Parameters'}
        [Format:
        - name (Type${options.technicalDepth === 'detailed' ? ', required/optional' : ''}): Description${options.technicalDepth === 'detailed' ? '. Default: \`value\`' : ''}]

        ${options.includeExamples ? `## Usage Example
        \`\`\`${change.filePath.endsWith('.tsx') ? 'tsx' : 'typescript'}
        [Practical example showing import and basic usage]
        \`\`\`` : ''}

        ##  Implementation
        [Key technical details${options.technicalDepth === 'detailed' ? ', algorithms, performance' : ''}]

        ##  Notes
        [Important considerations like accessibility, edge cases]

        ##  Change Summary
        [Recent modifications and why they were made]

        Code being documented:
        \`\`\`${change.filePath.endsWith('.tsx') ? 'tsx' : 'typescript'}
        ${change.code}
        \`\`\`

        Requirements:
        - Use clean markdown formatting
        - Include emoji headings
        - Be concise but thorough
        - Focus on practical developer needs`
      }],
      model: 'llama3-70b-8192',
      temperature: 0.3,
      max_tokens: 1500
    });

    const rawContent = response.choices[0]?.message?.content || '';
    const formatted = formatDocumentation(rawContent);

    // Cache the result
    docCache.set(cacheKey, formatted);
    return formatted;

  } catch (error) {
    console.error(`Documentation generation failed for ${change.name}:`, error);
    return `## Documentation Generation Error\nCould not generate docs for ${change.name}. Please check the implementation manually.\n\n\`\`\`typescript\n${change.code}\n\`\`\``;
  }
}

function formatDocumentation(content: string): string {
  return content
    .replace(/^#\s+/gm, '## ')
    .replace(/^##\s+/gm, '### ')
    // .replace(/```(\s*\n)/g, (match) =>
    //   match.includes('tsx') || match.includes('typescript') ? match : '```typescript\n'
    // )
    .replace(/\n{3,}/g, '\n\n'); // Remove excessive newlines
}