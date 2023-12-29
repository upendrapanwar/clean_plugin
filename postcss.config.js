module.exports = {
    plugins: {
        'postcss-import': {},
        'tailwindcss/nesting': {},
        tailwindcss: {},
        autoprefixer: {},
        cssnano: { preset: ['advanced', { zindex: false, }] }
    }
}