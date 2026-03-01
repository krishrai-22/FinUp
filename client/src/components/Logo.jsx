/**
 * Logo.jsx — FinUp brand mark.
 * Recreates the U+F upward-arrow monogram logo as an inline SVG.
 * Usage: <Logo size={28} color="white" />
 */
export default function Logo({ size = 28, color = "white" }) {
    return (
        <svg
            viewBox="0 0 68 80"
            width={size}
            height={size}
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* ── Arrow head (pointing up on left arm) ── */}
            <polygon points="7,0 0,22 14,22" />

            {/* ── Left vertical arm of U ── */}
            <rect x="0" y="20" width="14" height="36" />

            {/* ── U bottom curve ── */}
            <path d="M 0 54 Q 0 74 21 74 Q 42 74 42 54 L 28 54 Q 28 63 21 63 Q 14 63 14 54 Z" />

            {/* ── Right vertical arm of U (inner) ── */}
            <rect x="28" y="20" width="14" height="36" />

            {/* ── F: top horizontal bar ── */}
            <rect x="28" y="0" width="40" height="14" rx="3" />

            {/* ── F: middle horizontal bar ── */}
            <rect x="28" y="22" width="30" height="13" rx="2" />
        </svg>
    );
}
