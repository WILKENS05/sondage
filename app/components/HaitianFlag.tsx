export default function HaitianFlag({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 300 200"
            className={className}
            role="img"
            aria-label="Drapeau d'Haïti"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="300" height="100" fill="#00209F" />
            <rect y="100" width="300" height="100" fill="#D21034" />
            <circle cx="150" cy="100" r="42" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="2" />
            <g transform="translate(150,100)">
                <rect x="-3" y="-2" width="6" height="26" fill="#3B7A3B" />
                <ellipse cx="0" cy="-14" rx="26" ry="9" fill="#3B7A3B" transform="rotate(0)" />
                <ellipse cx="0" cy="-14" rx="26" ry="9" fill="#2F6B2F" transform="rotate(45)" />
                <ellipse cx="0" cy="-14" rx="26" ry="9" fill="#3B7A3B" transform="rotate(90)" />
                <ellipse cx="0" cy="-14" rx="26" ry="9" fill="#2F6B2F" transform="rotate(135)" />
                <ellipse cx="0" cy="8" rx="18" ry="6" fill="#8B5A2B" />
            </g>
        </svg>
    );
}
