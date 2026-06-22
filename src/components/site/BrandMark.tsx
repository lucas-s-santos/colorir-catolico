/** Emblema da marca: círculo dourado com cruz. */
export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="Ateliê Católico Digital"
    >
      <circle cx="20" cy="20" r="19" fill="var(--color-gold)" />
      <circle
        cx="20"
        cy="20"
        r="15"
        fill="none"
        stroke="var(--color-cream-soft)"
        strokeWidth="1"
        opacity="0.6"
      />
      <g fill="var(--color-cream-soft)">
        <rect x="18.4" y="9.5" width="3.2" height="21" rx="1.2" />
        <rect x="12.5" y="15" width="15" height="3.2" rx="1.2" />
      </g>
    </svg>
  );
}
