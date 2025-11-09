/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', // 根目录的 HTML
    './src/**/*.{vue,js,ts,jsx,tsx}', // 扫描 src 下所有 Vue/TS 文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
