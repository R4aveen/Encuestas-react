/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'background-page': '#fffffe',
                'background-secondary': '#e3f6f5',
                'text-headline': '#272343',
                'text-paragraph': '#2d334a',
                'primary': '#ffd803',
                'primary-text': '#272343',
                'highlight': '#bae8e8',
            }
        },
    },
    plugins: [],
}
