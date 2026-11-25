import Image from "next/image";
import { toneBg } from "@/lib/tones";

export default function ProductImage({
  src,
  alt,
  tone = "rose",
  sizes,
  priority = false,
  className = "aspect-[4/5]",
  rounded = "rounded-card",
}: {
  src?: string | null;
  alt: string;
  tone?: keyof typeof toneBg;
  sizes: string;
  priority?: boolean;
  className?: string;
  rounded?: string;
}) {
  return (
    <div className={`relative isolate overflow-hidden ${rounded} ${src ? "bg-[#f3f3f5]" : toneBg[tone]} ${className}`}>
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain mix-blend-multiply"
        />
      )}
    </div>
  );
}
