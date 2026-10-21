export type IconName =
  | 'route'
  | 'trip'
  | 'pin'
  | 'clock'
  | 'chevron'
  | 'close'
  | 'moon'
  | 'search'
  | 'bus';

export type IconProps = {
  name: IconName;
  className?: string;
};

export const Icon = ({ name, className = 'h-4 w-4' }: IconProps) => {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (name === 'route') {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 2v3m8-3v3M8 9h8m-8 5h.01M12 14h.01M16 14h.01" />
      </svg>
    );
  }

  if (name === 'trip') {
    return (
      <svg {...common}>
        <path d="M7 3v18M17 3v18M7 7h10M7 17h10M10 10h4M10 14h4" />
      </svg>
    );
  }

  if (name === 'pin') {
    return (
      <svg {...common}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (name === 'clock') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (name === 'chevron') {
    return (
      <svg {...common}>
        <path d="m9 18 6-6-6-6" />
      </svg>
    );
  }

  if (name === 'close') {
    return (
      <svg {...common}>
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    );
  }

  if (name === 'moon') {
    return (
      <svg {...common}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
      </svg>
    );
  }

  if (name === 'search') {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M5 17V5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5V17M3.5 17h17M7 17v2M17 17v2" />
      <path d="M5 11h14M8 7h.01M16 7h.01" />
      <circle cx="8" cy="14" r="1" />
      <circle cx="16" cy="14" r="1" />
    </svg>
  );
};
