import Image from "next/image";

// Drop-in replacement for ImagePlaceholder once real photography exists for
// a given spot — same className-driven sizing (aspect ratio, rounding,
// height) so swapping one for the other never touches surrounding layout.
export default function Photo({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
