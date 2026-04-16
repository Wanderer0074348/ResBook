import Link from "next/link";
import { Container } from "./Container";

export function Navbar() {
  return (
    <nav className="border-b border-black dark:border-white">
      <Container className="py-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold hover:opacity-75">
            resbook
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="hover:opacity-75">
              home
            </Link>
            <Link href="/tools" className="hover:opacity-75">
              tools
            </Link>
            <Link href="/workflows" className="hover:opacity-75">
              workflows
            </Link>
            <Link href="/dotfiles" className="hover:opacity-75">
              dotfiles
            </Link>
            <Link href="/collections" className="hover:opacity-75">
              collections
            </Link>
            <Link href="/compare" className="hover:opacity-75">
              compare
            </Link>
            <Link href="/analytics" className="hover:opacity-75">
              analytics
            </Link>
            <Link href="/submit" className="hover:opacity-75 text-green-600">
              submit
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}
