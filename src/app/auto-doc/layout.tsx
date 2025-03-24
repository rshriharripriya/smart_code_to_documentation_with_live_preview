// app/auto-doc/layout.tsx

import Link from "next/link";
export default function DocLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <nav className="p-4 border-b bg-white">
        <Link href="/" className="text-blue-600">← Back to Home</Link>
      </nav>
      {children}
    </div>
  );
}