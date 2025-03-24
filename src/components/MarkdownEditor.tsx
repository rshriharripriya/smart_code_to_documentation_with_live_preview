// components/MarkdownEditor.tsx
'use client';
import { useState, useEffect } from 'react';

export default function MarkdownEditor({
  initialContent,
  onSave,
  onGenerate,
  isGenerating
}: {
  initialContent: string;
  onSave: (content: string) => void;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
}) {
  const [content, setContent] = useState(initialContent);

  // Sync with external content changes
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate Docs'}
        </button>

        <button
          onClick={() => onSave(content)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow p-4 border rounded-lg font-mono text-sm"
        placeholder="Documentation will appear here..."
      />
    </div>
  );
}