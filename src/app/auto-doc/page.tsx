// app/page.tsx
'use client';
import { useState } from 'react';
import MarkdownPreview from '@/components/MarkdownPreview';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function Home() {
  const [docs, setDocs] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDocs = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/generate');

      if (!response.ok) {
        throw new Error(`Failed to generate docs: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      setDocs(text);
    } catch (err) {
      console.error('Documentation generation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate documentation';
      setError(errorMessage);
      setDocs(`# Error\n\n${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (newContent: string) => {
    setDocs(newContent);
    // Add your save logic here (e.g., API call to save to DB)
    try {
      // Example: await saveToDatabase(newContent);
      console.log('Documentation saved');
    } catch (err) {
      console.error('Failed to save documentation:', err);
    }
  };

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Smart Documentation Generator</h1>

      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Editor</h2>
          <MarkdownEditor
            initialContent={docs}
            onSave={handleSave}
            onGenerate={generateDocs}
            isGenerating={isGenerating}
          />
        </div>

        {/* Preview Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Live Preview</h2>
          <div className="border rounded-lg p-4 h-[600px] overflow-auto bg-white">
            {docs ? (
              <MarkdownPreview content={docs} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 italic">
                {isGenerating
                  ? 'Generating documentation...'
                  : 'Click "Generate Docs" to start'}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}