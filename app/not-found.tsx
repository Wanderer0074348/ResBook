import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-lg text-center">
        <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700">404</h1>
        
        <h2 className="text-2xl font-bold mt-4 mb-4">Page not found</h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black"
          >
            <Home className="w-4 h-4" />
            Go home
          </Link>
          
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-4 py-2 border border-black dark:border-white"
          >
            <Search className="w-4 h-4" />
            Search
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>Browse by section:</p>
          <div className="flex gap-4 justify-center mt-2">
            <Link href="/tools" className="hover:underline">Tools</Link>
            <Link href="/workflows" className="hover:underline">Workflows</Link>
            <Link href="/dotfiles" className="hover:underline">Dotfiles</Link>
          </div>
        </div>
      </div>
    </div>
  );
}