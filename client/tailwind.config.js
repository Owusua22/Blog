/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
theme: {
    extend: {
      // ===== COLOR PALETTE =====
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#0B1D3A',
          50:  '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#1B3A5C',
          900: '#0B1D3A',
          950: '#071222',
        },

        // Gold Accent
        gold: {
          DEFAULT: '#C5A34E',
          50:  '#FBF7EC',
          100: '#F5ECCE',
          200: '#EDDC9E',
          300: '#E2C96E',
          400: '#D4B555',
          500: '#C5A34E',
          600: '#A88A3D',
          700: '#8B7030',
          800: '#6E5824',
          900: '#5A481D',
        },

        // Background Colors
        surface: {
          DEFAULT: '#F4F1EB',
          50:  '#FFFFFF',
          100: '#FAF9F7',
          200: '#F4F1EB',
          300: '#E8E3D9',
          400: '#D4CFC7',
          500: '#B8B2A7',
        },

        // Text Colors
        ink: {
          DEFAULT: '#2C2C2C',
          heading: '#0B1D3A',
          body:    '#2C2C2C',
          muted:   '#6B7280',
          light:   '#9CA3AF',
          onDark:  '#F4F1EB',
        },

        // Semantic Colors
        parliament: {
          navy:      '#0B1D3A',
          royal:     '#1B3A5C',
          steel:     '#334E68',
          gold:      '#C5A34E',
          parchment: '#F4F1EB',
          ivory:     '#FAF9F7',
        },
      },

      // ===== TYPOGRAPHY =====
      fontFamily: {
        // Headings - Elegant Serif
        heading: [
          'Cormorant Garamond',
          'Playfair Display',
          'Georgia',
          'Times New Roman',
          'serif',
        ],

        // Body - Readable Serif
        body: [
          'Source Serif Pro',
          'Lora',
          'Georgia',
          'serif',
        ],

        // Navigation & UI - Clean Sans-serif
        sans: [
          'Inter',
          'DM Sans',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],

        // Quotes & Special Text
        quote: [
          'Lora',
          'Cormorant Garamond',
          'Georgia',
          'serif',
        ],
      },

      // ===== FONT SIZES =====
      fontSize: {
        'display-1': ['4.5rem',   { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-2': ['3.75rem',  { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-1': ['3rem',     { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-2': ['2.25rem',  { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-3': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-4': ['1.5rem',   { lineHeight: '1.35', fontWeight: '600' }],
        'subtitle':  ['1.25rem',  { lineHeight: '1.5', fontWeight: '400' }],
        'body-lg':   ['1.125rem', { lineHeight: '1.75', fontWeight: '400' }],
        'body':      ['1rem',     { lineHeight: '1.75', fontWeight: '400' }],
        'body-sm':   ['0.875rem', { lineHeight: '1.7', fontWeight: '400' }],
        'caption':   ['0.75rem',  { lineHeight: '1.5', fontWeight: '400' }],
      },

      // ===== SPACING =====
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },

      // ===== MAX WIDTH =====
      maxWidth: {
        'article': '720px',
        'content': '960px',
        'wide':    '1200px',
        'full':    '1440px',
      },

      // ===== BORDER RADIUS =====
      borderRadius: {
        'minimal': '2px',
        'subtle':  '4px',
      },

      // ===== BOX SHADOW =====
      boxShadow: {
        'card':     '0 1px 3px rgba(11, 29, 58, 0.08), 0 1px 2px rgba(11, 29, 58, 0.06)',
        'card-hover': '0 10px 25px rgba(11, 29, 58, 0.1), 0 4px 10px rgba(11, 29, 58, 0.05)',
        'nav':      '0 2px 8px rgba(11, 29, 58, 0.1)',
        'gold':     '0 4px 14px rgba(197, 163, 78, 0.3)',
      },

      // ===== ANIMATIONS =====
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gold-shimmer': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'fade-in':      'fade-in 0.6s ease-out',
        'gold-shimmer': 'gold-shimmer 3s linear infinite',
      },

      // ===== BACKGROUND IMAGE =====
      backgroundImage: {
        'gold-gradient':   'linear-gradient(135deg, #C5A34E 0%, #E2C96E 50%, #C5A34E 100%)',
        'navy-gradient':   'linear-gradient(180deg, #0B1D3A 0%, #1B3A5C 100%)',
        'hero-overlay':    'linear-gradient(180deg, rgba(11,29,58,0.7) 0%, rgba(11,29,58,0.9) 100%)',
      },
    },
  },
  plugins: [],
};