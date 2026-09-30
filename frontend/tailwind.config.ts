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
        // Core National Platform Palette
        primary: {
          navy: "#12355B",
          blue: "#1769AA",
        },
        accent: {
          teal: "#00A6A6",
          "light-teal": "#DFF5F3",
        },
        page: {
          bg: "#F7F9FC",
          card: "#FFFFFF",
        },
        text: {
          primary: "#172B4D",
          secondary: "#64748B",
        },
        border: {
          DEFAULT: "#E2E8F0",
        },
        // Institutional Theme Aliases
        gov: {
          navy: {
            dark: "#0D2744",
            DEFAULT: "#12355B",
            light: "#1D4B7D",
            accent: "#00A6A6",
          },
          blue: {
            dark: "#135488",
            DEFAULT: "#1769AA",
            light: "#EBF3FB",
          },
          teal: {
            dark: "#008B8B",
            DEFAULT: "#00A6A6",
            light: "#DFF5F3",
          },
          slate: {
            50: "#F7F9FC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            600: "#475569",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A",
          },
          status: {
            success: "#16875D",
            "success-bg": "#E8F8F0",
            warning: "#D89B18",
            "warning-bg": "#FEF8E7",
            error: "#D64545",
            "error-bg": "#FDF2F2",
            info: "#1769AA",
            "info-bg": "#EBF3FB",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        input: "8px",
        btn: "10px",
        card: "12px",
        container: "16px",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(18, 53, 91, 0.05), 0 1px 2px rgba(18, 53, 91, 0.03)",
        card: "0 4px 20px rgba(18, 53, 91, 0.06)",
        elevated: "0 10px 25px -3px rgba(18, 53, 91, 0.08), 0 4px 10px -2px rgba(18, 53, 91, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;

