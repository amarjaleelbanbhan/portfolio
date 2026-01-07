import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight">
      <Navbar />
      <main className="flex-1 section-container flex flex-col items-center justify-center text-center gap-4">
        <p className="text-accent font-semibold">404</p>
        <h1 className="text-4xl font-bold text-slate-100">Page not found</h1>
        <p className="text-slate-300 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s head back to the homepage and explore more work.
        </p>
        <Link
          href="/"
          className="px-5 py-3 bg-accent text-midnight font-semibold rounded-lg shadow-lg shadow-accent/30"
        >
          Go home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
