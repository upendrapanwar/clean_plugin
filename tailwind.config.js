module.exports = {
  content: [
    './assets/**/*.{js,php,html}',
    './src/**/*.{js,php,html}',
    './templates/**/*.php',
  ],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
