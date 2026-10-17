/** Animated line diagrams — one per product, drawn rather than shipped as art. */
export default function Glyph({ name, className = '' }) {
  const common = {
    className: `h-full w-full ${className}`,
    viewBox: '0 0 120 120',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  if (name === 'geofit')
    return (
      <svg {...common}>
        <rect x="16" y="26" width="42" height="68" rx="4" />
        <path d="M62 26h42v68H62" strokeDasharray="4 5" />
        <path d="M58 40v40" className="text-blue-600" />
        <path d="M52 56l6-6 6 6M52 64l6 6 6-6" className="text-blue-600" />
        <circle cx="24" cy="60" r="3" className="text-blue-600" />
      </svg>
    )

  if (name === 'geoinspect')
    return (
      <svg {...common}>
        <rect x="18" y="30" width="84" height="60" rx="6" />
        <circle cx="60" cy="60" r="18" />
        <circle cx="60" cy="60" r="7" className="text-blue-600" />
        <path d="M18 44h10M92 44h10M18 76h10M92 76h10" />
        <path d="M44 34v-10M76 34v-10" strokeDasharray="3 4" />
      </svg>
    )

  if (name === 'geopredict')
    return (
      <svg {...common}>
        <path d="M14 92h92" />
        <path d="M18 78l16-14 14 10 16-26 14 18 16-30" />
        <path d="M78 66l16-30" className="text-blue-600" strokeDasharray="4 4" />
        <circle cx="94" cy="36" r="4" className="text-blue-600" />
        <path d="M14 30v62" />
      </svg>
    )

  if (name === 'engineering')
    return (
      <svg {...common}>
        <path d="M24 96V36l36-18 36 18v60" />
        <path d="M24 60h72M60 18v78" strokeDasharray="4 5" />
        <circle cx="60" cy="60" r="9" className="text-blue-600" />
        <path d="M14 96h92" />
      </svg>
    )

  // geoset
  return (
    <svg {...common}>
      <path d="M20 84l24-48 32 22 24-34" />
      <circle cx="44" cy="36" r="5" className="text-blue-600" />
      <circle cx="76" cy="58" r="5" className="text-blue-600" />
      <circle cx="100" cy="24" r="5" className="text-blue-600" />
      <rect x="18" y="88" width="84" height="10" rx="3" />
      <path d="M32 88V72M88 88V66" strokeDasharray="3 4" />
    </svg>
  )
}
