// app/(landing)/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">My Awesome Project</h1>

      <section className="max-w-2xl mb-12">
        <p className="text-lg mb-4">
          Welcome to our project! We automatically document all code changes.
        </p>
        <Link
          href="/auto-doc"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Auto Documentation
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        {/*  marketing content */}
      </section>
    </main>
  );
}