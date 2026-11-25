import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ArchPlaceholder from "./ArchPlaceholder";

const HERO_IMAGE: string | null = "/images/products/quiet-cardigan-rose.jpg";
const HERO_ALT = "Rose chunky-knit cardigan with buttons";

export default function Hero() {
  return (
    <section className="hero-bg relative overflow-hidden px-6 pb-16 pt-28 text-ink md:pb-24 md:pt-36">
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.25em]">
            A quieter kind of everyday
          </p>

          <h1 className="mt-4 text-balance font-serif text-5xl leading-[0.98] tracking-[-0.03em] md:text-7xl">
            Made for the life you live.
          </h1>

          <Link
            href="/shop"
            className="btn-primary mt-8 inline-flex min-h-14 items-center gap-3 rounded-full px-8 text-lg font-semibold"
          >
            Shop the collection <ArrowRight size={20} aria-hidden />
          </Link>
        </div>

        <div className="mx-auto w-full max-w-[420px]">
          {HERO_IMAGE ? (
            <div className="relative isolate aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[28px] bg-[#f3f3f5]">
              <div className="absolute inset-x-6 bottom-8 top-24">
                <Image
                  src={HERO_IMAGE}
                  alt={HERO_ALT}
                  fill
                  priority
                  sizes="(min-width: 1024px) 420px, 80vw"
                  className="object-contain mix-blend-multiply"
                />
              </div>
            </div>
          ) : (
            <ArchPlaceholder tone="rose" className="aspect-[4/5] w-full rounded-t-[999px] rounded-b-[28px] overflow-hidden" />
          )}
        </div>
      </div>
    </section>
  );
}
