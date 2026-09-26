import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Full 9-Shade Oceanic Cyan-Sapphire Gradient Palette:
        ocean: {
          950: "#03045E", // Deep Midnight Navy
          900: "#023E8A", // Royal Sovereign Blue
          800: "#0077B6", // Deep Cobalt Ocean
          700: "#0096C7", // Vibrant Azure
          600: "#00B4D8", // Bright Cerulean Cyan
          500: "#48CAE4", // Sky Aqua
          400: "#90E0EF", // Soft Ice Blue
          300: "#ADE8F4", // Pale Mist Cyan
          200: "#CAF0F8", // Pristine Light Ice
          100: "#E6F8FB", // Ultra-light tint
          50:  "#F2FCFD", // Canvas background
        },
        brand: {
          midnight: "#03045E",
          royal: "#023E8A",
          cobalt: "#0077B6",
          azure: "#0096C7",
          cerulean: "#00B4D8",
          aqua: "#48CAE4",
          ice: "#90E0EF",
          mist: "#ADE8F4",
          bg: "#CAF0F8",
          surface: "#FFFFFF",
        },
        // Theme Aliases mapped to User Palette for full system uniformity
        gov: {
          navy: {
            dark: "#03045E",
            DEFAULT: "#023E8A",
            light: "#0077B6",
            accent: "#00B4D8",
          },
          amber: {
            dark: "#0077B6",
            DEFAULT: "#0096C7",
            light: "#48CAE4",
          },
          slate: {
            50: "#CAF0F8",
            100: "#ADE8F4",
            200: "#90E0EF",
            300: "#48CAE4",
            400: "#00B4D8",
            500: "#0096C7",
            600: "#0077B6",
            700: "#023E8A",
            800: "#03045E",
            900: "#010238",
          },
          status: {
            success: "#0077B6",
            "success-bg": "#CAF0F8",
            warning: "#D97706",
            "warning-bg": "#FEF3C7",
            error: "#DC2626",
            "error-bg": "#FEE2E2",
            info: "#0096C7",
            "info-bg": "#CAF0F8",
          },
        },
        blue: {
          50: "#CAF0F8",
          100: "#ADE8F4",
          200: "#90E0EF",
          300: "#48CAE4",
          400: "#00B4D8",
          500: "#0096C7",
          600: "#0077B6",
          700: "#023E8A",
          800: "#03045E",
          900: "#020340",
          950: "#010224",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        'ocean-sm': "0 2px 8px -1px rgba(3, 4, 94, 0.08), 0 1px 4px -1px rgba(0, 119, 182, 0.06)",
        'ocean-md': "0 8px 24px -4px rgba(3, 4, 94, 0.12), 0 4px 12px -2px rgba(0, 119, 182, 0.08)",
        'ocean-lg': "0 16px 36px -6px rgba(3, 4, 94, 0.18), 0 6px 16px -3px rgba(0, 180, 216, 0.12)",
        'ocean-glow': "0 0 25px rgba(72, 202, 228, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
