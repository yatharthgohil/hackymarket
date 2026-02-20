export default function CoinIcon({ className = "inline-block w-[1.4em] h-[1.4em] align-[-0.25em]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="#FFBC0A" stroke="#E5A809" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6" fill="none" stroke="#E5A809" strokeWidth="1.2" opacity="0.8" />
    </svg>
  );
}
