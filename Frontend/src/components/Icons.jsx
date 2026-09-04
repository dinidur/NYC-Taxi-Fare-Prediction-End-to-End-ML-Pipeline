/* Hand-rolled 1.5px stroke icons on a 24px grid.
   Consistent stroke weight and terminal style is what makes an icon set
   look like a set rather than a pile of clip art. */

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const IconRoute = (p) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M8.5 6H14a3.5 3.5 0 0 1 0 7h-4a3.5 3.5 0 0 0 0 7h5.5" />
  </svg>
)

export const IconCloud = (p) => (
  <svg {...base} {...p}>
    <path d="M6.5 18h10a3.5 3.5 0 0 0 .3-6.99A5 5 0 0 0 7.2 9.6 3.7 3.7 0 0 0 6.5 18Z" />
  </svg>
)

export const IconTag = (p) => (
  <svg {...base} {...p}>
    <path d="M3 12.5V4.5A1.5 1.5 0 0 1 4.5 3h8l8.5 8.5a1.5 1.5 0 0 1 0 2.1l-6.9 6.9a1.5 1.5 0 0 1-2.1 0L3 12.5Z" />
    <circle cx="7.5" cy="7.5" r="1.25" />
  </svg>
)

export const IconLayers = (p) => (
  <svg {...base} {...p}>
    <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
    <path d="m4 12 8 4.2 8-4.2" />
    <path d="m4 16.5 8 4.2 8-4.2" />
  </svg>
)

export const IconArrowRight = (p) => (
  <svg {...base} {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

export const IconArrowDown = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4v15" />
    <path d="m6 13 6 6 6-6" />
  </svg>
)

export const IconAlert = (p) => (
  <svg {...base} {...p}>
    <path d="M12 8.5v4.5" />
    <path d="M12 16.2h.01" />
    <path d="M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20.2h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
  </svg>
)

export const IconRefresh = (p) => (
  <svg {...base} {...p}>
    <path d="M20 11a8 8 0 0 0-13.6-4.6L3 9.5" />
    <path d="M3 5v4.5h4.5" />
    <path d="M4 13a8 8 0 0 0 13.6 4.6L21 14.5" />
    <path d="M21 19v-4.5h-4.5" />
  </svg>
)

export const IconTerminal = (p) => (
  <svg {...base} {...p}>
    <rect x="2.75" y="4.25" width="18.5" height="15.5" rx="2" />
    <path d="m7 9.5 3 2.5-3 2.5" />
    <path d="M12.5 15h4" />
  </svg>
)

export const IconGrid = (p) => (
  <svg {...base} {...p}>
    <rect x="3.25" y="3.25" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.25" y="3.25" width="7.5" height="7.5" rx="1.5" />
    <rect x="3.25" y="13.25" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.25" y="13.25" width="7.5" height="7.5" rx="1.5" />
  </svg>
)
