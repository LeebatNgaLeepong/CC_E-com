import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "Our story" };

const values = [
  { title: "Our approach", body: "Replace this with the client's own words about how they design." },
  { title: "Our materials", body: "Replace this with the client's own words about what they use." },
  { title: "Our promise", body: "Replace this with the client's own words about what customers can expect." },
];

export default function OurStoryPage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero-bg px-6 pb-24 pt-[24vh] text-center text-ink">
          <p className="text-xs font-semibold uppercase tracking-[0.25em]">Our story</p>
          <h1 className="mx-auto mt-5 max-w-4xl font-serif text-6xl leading-[0.95] tracking-[-0.03em] md:text-8xl">
            A quieter kind of everyday.
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg text-ink-soft">
            Replace this paragraph with a short introduction from the client.
          </p>
        </section>
        <section className="mx-auto grid max-w-[1180px] gap-8 px-6 py-24 md:grid-cols-3 md:px-12">
          {values.map((value) => (
            <div key={value.title} className="rounded-card bg-card p-8 shadow-sm">
              <h2 className="font-serif text-3xl tracking-tight">{value.title}</h2>
              <p className="mt-4 text-ink-soft">{value.body}</p>
            </div>
          ))}
        </section>
        <section className="px-6 pb-28 text-center">
          <Link href="/shop" className="btn-primary inline-flex min-h-14 items-center rounded-full px-9 text-lg font-semibold">
            Shop the collection
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
