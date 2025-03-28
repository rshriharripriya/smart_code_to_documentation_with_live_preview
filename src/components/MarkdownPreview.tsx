// components/MarkdownPreview.tsx

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import 'highlight.js/styles/github-dark.css';
import React from 'react';

export default function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none p-4">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          [remarkToc, { heading: 'Contents', maxDepth: 3 }]
        ]}
        rehypePlugins={[
          rehypeHighlight,
          rehypeSlug
        ]}
        components={{
         // Handle paragraphs containing block elements
          p: ({ children, ...props }) => {
            const hasBlockElements = React.Children.toArray(children).some(
              (child) => React.isValidElement(child) && child.type === 'pre'
            );

            return hasBlockElements ? (
              <div {...props}>{children}</div>
            ) : (
              <p {...props}>{children}</p>
            );
          },
          h1: ({ id, ...props }) => (
            <h1
              className="text-3xl font-bold mt-8 mb-6 border-b pb-2"
              id={id}
              {...props}
            />
          ),
          h2: ({ id, ...props }) => (
            <h2
              className="text-2xl font-semibold mt-8 mb-4 border-b pb-2"
              id={id}
              {...props}
            />
          ),
          h3: ({ id, ...props }) => (
            <h3
              className="text-xl font-medium mt-6 mb-3"
              id={id}
              {...props}
            />
          ),
          code: ({ inline, className, children, ...props }: { inline?: boolean, className?: string, children?: React.ReactNode }) => {
            // Single backtick (`) wrapped code - inline
            if (inline) {
              return (
                <code
                  className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // Triple backtick (```) wrapped code - block
            return (
              <div className="relative my-4">
                <div className="absolute right-2 top-2 flex gap-1">
                  <button
                    onClick={() => navigator.clipboard.writeText(String(children))}
                    className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          table: (props) => (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse" {...props} />
            </div>
          ),
          th: (props) => (
            <th className="border bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold" {...props} />
          ),
          td: (props) => (
            <td className="border px-4 py-2" {...props} />
          ),
          img: ({ src, alt, title }) => (
            <figure className="my-6">
              <img
                src={src || ''}
                alt={alt || ''}
                className="rounded-lg border shadow-sm max-w-full mx-auto"
              />
              {title && (
                <figcaption className="text-center text-sm text-gray-500 mt-2">
                  {title}
                </figcaption>
              )}
            </figure>
          ),
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300 my-4"
              {...props}
            />
          ),
          ul: (props) => (
            <ul className="list-disc pl-6 space-y-1 my-4" {...props} />
          ),
          ol: (props) => (
            <ol className="list-decimal pl-6 space-y-1 my-4" {...props} />
          ),
          a: (props) => (
            <a
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}