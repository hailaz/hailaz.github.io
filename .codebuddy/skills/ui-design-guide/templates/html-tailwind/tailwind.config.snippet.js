// tailwind.config.snippet.js
// ----------------------------------------------------------
// 该 snippet 展示如何让 Tailwind 完全引用本 Skill 的 CSS Variables。
// 复制到你项目的 tailwind.config.{js,ts,mjs} 的 theme.extend 中。
// 注意：本文件仅作配置参考，不可执行依赖。

module.exports = {
  // 暗黑模式由 [data-theme="dark"] 触发
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          DEFAULT: 'var(--color-primary-500)',
        },
        neutral: {
          50:  'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
        success: { 500: 'var(--color-success-500)' /* 同理可补 50-900 */ },
        warning: { 500: 'var(--color-warning-500)' },
        danger:  { 500: 'var(--color-danger-500)' },
        info:    { 500: 'var(--color-info-500)' },
      },
      spacing: {
        0:  'var(--space-0)',
        1:  'var(--space-1)',
        2:  'var(--space-2)',
        3:  'var(--space-3)',
        4:  'var(--space-4)',
        6:  'var(--space-6)',
        8:  'var(--space-8)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        24: 'var(--space-24)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        none: 'var(--shadow-none)',
        sm:   'var(--shadow-sm)',
        md:   'var(--shadow-md)',
        lg:   'var(--shadow-lg)',
        xl:   'var(--shadow-xl)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        serif: 'var(--font-serif)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        xs:   ['var(--font-size-xs)',   { lineHeight: 'var(--leading-normal)' }],
        sm:   ['var(--font-size-sm)',   { lineHeight: 'var(--leading-normal)' }],
        base: ['var(--font-size-base)', { lineHeight: 'var(--leading-normal)' }],
        lg:   ['var(--font-size-lg)',   { lineHeight: 'var(--leading-normal)' }],
        xl:   ['var(--font-size-xl)',   { lineHeight: 'var(--leading-tight)'  }],
        '2xl':['var(--font-size-2xl)',  { lineHeight: 'var(--leading-tight)'  }],
        '3xl':['var(--font-size-3xl)',  { lineHeight: 'var(--leading-tight)'  }],
        '4xl':['var(--font-size-4xl)',  { lineHeight: 'var(--leading-tight)'  }],
        '5xl':['var(--font-size-5xl)',  { lineHeight: 'var(--leading-tight)'  }],
      },
      // Tailwind 不直接支持 var() 作为 screens 值，但可硬编码与 token 一致
      screens: {
        sm: '768px',   // tablet
        md: '1024px',  // desktop
        lg: '1440px',  // wide
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
      },
      transitionTimingFunction: {
        standard:   'var(--ease-standard)',
        emphasized: 'var(--ease-emphasized)',
      },
      zIndex: {
        dropdown: 'var(--z-dropdown)',
        sticky:   'var(--z-sticky)',
        modal:    'var(--z-modal)',
        popover:  'var(--z-popover)',
        toast:    'var(--z-toast)',
      },
    },
  },
  plugins: [],
};
