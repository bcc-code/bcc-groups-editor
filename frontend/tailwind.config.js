import {
  bccForbundetTheme,
  tailwindPlugin,
} from "@bcc-code/design-library-vue";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [bccForbundetTheme],
  content: [
    "./index.html",
    "./node_modules/@bcc-code/design-library-vue/dist/design-library-vue.js",
    "./src/**/*.{vue,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindPlugin],
};
