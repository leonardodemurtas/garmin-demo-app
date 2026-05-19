/*
 * Tailwind Play CDN theme extension.
 *
 * Mirrors styles/tokens.css. The CSS file is the source of truth;
 * this config is an additive convenience for Tailwind-class authors.
 *
 * Usage in HTML files (after the CDN script):
 *   <script src="https://cdn.tailwindcss.com"></script>
 *   <script src="./tailwind.config.js"></script>
 */

tailwind.config = {
  theme: {
    extend: {
      colors: {
        pe: {
          canvas: '#08090A',
          'panel-deep': '#0F1011',
          'panel-raised': '#141516',
          'panel-selected': '#1C1C1F',
          'chip-raised': '#232326',
          'text-primary': '#F7F8F8',
          'text-secondary': '#D0D6E0',
          'text-metadata': '#8A8F98',
          'text-dim': '#62666D',
          'text-figure-label': '#3A3D44',
          accent: '#FF7133',
          'accent-muted-1': '#CE5C2B',
          'accent-muted-2': '#9C4723',
          'accent-muted-3': '#6B331A',
          'accent-muted-4': '#391E12',
          'status-green': '#5BC47A',
          'status-yellow': '#F2C94C',
          'status-red': '#EB5757',
          'status-teal': '#4EC3C7',
          'status-orange': '#F2994A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'pe-figure-label': '20px',
        'pe-caption-headline': '26px',
        'pe-caption-body': '26px',
        'pe-ui-label': '24px',
        'pe-ui-metadata': '18px',
        'pe-annotation': '20px',
      },
      borderRadius: {
        'pe-panel': '16px',
        'pe-panel-lg': '20px',
        'pe-chip': '999px',
        'pe-chip-square': '6px',
        'pe-composer': '20px',
      },
      boxShadow: {
        'pe-soft': '0 30px 60px -24px rgba(0,0,0,0.65)',
      },
      opacity: {
        'dim-1': '0.45',
        'dim-2': '0.25',
        'dim-3': '0.15',
      },
    },
  },
};
