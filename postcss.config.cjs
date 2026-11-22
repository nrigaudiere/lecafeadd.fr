// Mantine styles require its PostCSS preset (breakpoint variables). Applied only
// to @mantine packages so the rest of the site CSS (Tailwind, daisyUI) stays untouched.
module.exports = ctx => {
  if (!ctx.file || !ctx.file.includes('node_modules/@mantine')) {
    return { plugins: {} }
  }
  return {
    plugins: {
      'postcss-preset-mantine': {},
      'postcss-simple-vars': {
        variables: {
          'mantine-breakpoint-xs': '36em',
          'mantine-breakpoint-sm': '48em',
          'mantine-breakpoint-md': '62em',
          'mantine-breakpoint-lg': '75em',
          'mantine-breakpoint-xl': '88em',
        },
      },
    },
  }
}
