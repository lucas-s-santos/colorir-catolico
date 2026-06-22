import Image from "next/image";

interface BookCoverProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

/**
 * Capa de um livro. Usa next/image para os PNGs (otimização) e <img> para o
 * placeholder SVG do combo. As capas reais são A4 (2480x3508, proporção √2).
 */
export function BookCover({ src, alt, priority, className = "" }: BookCoverProps) {
  const base =
    "h-auto w-full rounded-lg shadow-lg ring-1 ring-gold/20 " + className;

  if (src.endsWith(".svg")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={base} loading="lazy" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={2480}
      height={3508}
      priority={priority}
      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 33vw, 320px"
      className={base}
    />
  );
}
