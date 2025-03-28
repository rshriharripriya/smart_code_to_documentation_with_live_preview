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
          <p>Commit: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0,7)}</p>
      <p>Branch: {process.env.main}</p>
      </nav>
      {children}
    </div>
  );
}