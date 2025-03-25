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
        content: `Generate precise documentation for this code implementation. Analyze the actual code and provide specific details:

        ### File: ${change.filePath}
        ### Component/Function: ${change.name}

        ## Purpose
        Analyze the code and describe:
        - Its primary function and responsibilities
        - Specific UI elements it renders (if applicable)
        - Key dependencies it relies on

        ## ${change.type === 'component' ? 'Props' : 'Parameters'}
        For each ${change.type === 'component' ? 'prop' : 'parameter'} found in the code:
        - name (Type${options.technicalDepth === 'detailed' ? ', required/optional' : ''}): Purpose in the implementation
        ${options.technicalDepth === 'detailed' ? '- Default value if specified' : ''}

        ${options.includeExamples ? `## Usage Example 
        \`\`\`${change.filePath.endsWith('.tsx') ? 'tsx' : 'typescript'}
        // Show realistic usage with required imports
        // Include any necessary context or parent components
        \`\`\`` : ''}

        ## Implementation Analysis
        [If any of these specific aspects are inapplicable to a change, then dont display that aspect]
        Describe these specific aspects from the code only if they are applicable:
        1. Key logic flows and control structures
        2. State management (hooks, context, etc.)
        3. Important side effects or API calls
        4. Performance considerations
        5. Unique implementation details

        ## Notes
        Document:
        - Any assumptions the code makes
        - Accessibility considerations
        - Error handling approaches
        - Known limitations or edge cases

        ## Change History
        [If change history is available, otherwise omit this section]

        Actual Code Being Documented:
        \`\`\`${change.filePath.endsWith('.tsx') ? 'tsx' : 'typescript'}
        ${change.code}
        \`\`\`

        Strict Requirements:
        1. Only use triple backticks (\`\`\`) for code examples
        2. You will never use single backticks (\`) for variables/props. 
        3. Be specific to this implementation - no generic descriptions
        4. Mention exact UI elements, hooks, and patterns used
        5. Format parameters/props as plain text lists with - bullets
        6. If you decide to omit a section, you will not mention its heading
            You will NOT display the heading in the following manner , you will just skip that heading instead
            "Change History
            [Not available]"  
        7. You will display all identifiers in bold      
 `



      }],
      model: 'llama3-70b-8192',
      temperature: 0.3,  // Lower temperature for more focused output
      max_tokens: 2000   // Increased for more detailed analysis
    });

    const rawContent = response.choices[0]?.message?.content || '';
    const formatted = formatDocumentation(rawContent);

    // Cache the result
    docCache.set(cacheKey, formatted);
    return formatted;

  } catch (error) {
    console.error(`Documentation generation failed for ${change.name}:`, error);
    return `## Documentation Generation Error\nCould not generate docs for ${change.name}. Please check the implementation manually.\n\n${change.code}`;
  }
}

function formatDocumentation(content: string): string {
  return content
    .replace(/^#\s+/gm, '## ')
    .replace(/^##\s+/gm, '### ')
    .replace(/\n{3,}/g, '\n\n'); // Remove excessive newlines
}