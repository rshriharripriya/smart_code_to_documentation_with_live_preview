// app/(landing)/layout.tsx
import Link from "next/link";
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-white text-gray-900">
      <nav className="p-4 border-b">
        <Link href="/" className="font-bold text-xl">My Project</Link>
      </nav>
      {children}
    </div>
  );
}