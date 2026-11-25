import Header from "@/components/Header";

export const metadata = { title: "Our story" };

export default function OurStoryPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1180px] px-6 pb-28 pt-40 md:px-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-bloom-deep">
          Our story
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl tracking-[-0.03em] md:text-7xl">
          A quieter kind of everyday.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
          Conscious Clothing creates thoughtful essentials for everyday life,
          with comfort, considered details and a softer palette at the centre.
        </p>
      </main>
    </>
  );
}
