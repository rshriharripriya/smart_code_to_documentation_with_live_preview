// app/page.tsx
'use client';
import { useState } from 'react';
import MarkdownPreview from '@/components/MarkdownPreview';
import MarkdownEditor from '@/components/MarkdownEditor';
// import ScreenshotEditor from '@/components/ScreenshotEditor';

export default function Home() {
  const [docs, setDocs] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  // const [editingImage, setEditingImage] = useState<string | null>(null);

  const generateDocs = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate');
      const generatedDocs = await response.text();
      setDocs(generatedDocs);
    } finally {
      setIsGenerating(false);
    }
  };

  // const handleImageSave = (editedImage: string) => {
  //   if (editingImage) {
  //     const updatedDocs = docs.replace(editingImage, editedImage);
  //     setDocs(updatedDocs);
  //     setEditingImage(null);
  //   }
  // };

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Smart Documentation Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Editor</h2>
          <MarkdownEditor
            initialContent={docs}
            onSave={(newContent) => {
              setDocs(newContent);
              // Add your save logic here (e.g., API call to save to DB)
            }}
            onGenerate={generateDocs}
            isGenerating={isGenerating}
          />
        </div>

        {/* Preview Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Live Preview</h2>
          <div className="border rounded-lg p-4 h-[600px] overflow-auto">
            {docs ? (
              <MarkdownPreview
                content={docs}
                // onImageClick={setEditingImage}
              />
            ) : (
              <div className="text-gray-500 italic">
                Generated documentation will appear here
              </div>
            )}
          </div>
        </div>
      </div>

      {/*/!* Screenshot Editor Modal *!/*/}
      {/*{editingImage && (*/}
      {/*  <ScreenshotEditor*/}
      {/*    imageUrl={editingImage}*/}
      {/*    onSave={handleImageSave}*/}
      {/*    onClose={() => setEditingImage(null)}*/}
      {/*  />*/}
      {/*)}*/}
    </main>
  );
}