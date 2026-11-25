import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bloom-deep">Not found</p>
        <h1 className="mt-3 font-serif text-5xl">We couldn’t find that piece.</h1>
        <Link href="/shop" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-btn px-6 font-semibold text-on-btn hover:bg-btn-hover">
          Back to shop
        </Link>
      </div>
    </main>
  );
}
