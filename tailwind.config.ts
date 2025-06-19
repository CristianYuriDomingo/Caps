import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}'
  ],
  // Note: v4 uses different plugin syntax
  plugins: [
    // You might need to check if flowbite supports v4
    // require('flowbite/plugin')
  ],
}
export default config