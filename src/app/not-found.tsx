import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-parchment-50 px-6 text-center">
      <p className="font-serif text-8xl font-light text-obsidian-200">404</p>
      
      <div className="mt-8 space-y-4">
        <h1 className="font-serif text-3xl font-light text-obsidian-900">
          Page Not Found
        </h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-obsidian-500">
          We couldn't find the page you're looking for. It might have been moved or no longer exists.
        </p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="bg-obsidian-900 px-8 py-4 text-[10px] uppercase tracking-[0.3em] text-parchment-50 transition-colors hover:bg-obsidian-800"
        >
          Return Home
        </Link>
        <Link
          href="/#units"
          className="border border-parchment-300 px-8 py-4 text-[10px] uppercase tracking-[0.3em] text-obsidian-600 transition-colors hover:border-obsidian-400 hover:text-obsidian-900"
        >
          View Retreats
        </Link>
      </div>
    </div>
  );
}
