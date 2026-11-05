/**
 * NovaKit Lite — design tokens.
 * These are the shared vocabulary every screen should build from.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand — indigo, with a full tint ramp for surfaces, hovers and emphasis.
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          400: "#818CF8",
          DEFAULT: "#4F46E5", // primary
          pressed: "#3730A3",
          800: "#312E81",
        },
        // Accent — warm amber, for highlights and expressive moments.
        accent: {
          50: "#FFF7E6",
          100: "#FDECC8",
          DEFAULT: "#F59E0B",
          600: "#B45309",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F2F2F2",
          200: "#ECECEC",
          300: "#D9D9D9",
          500: "#808080", // 3.95:1 on white: large text and decoration only
          600: "#666666", // 5.74:1 on white: captions and secondary text
          700: "#4D4D4D",
          900: "#1A1A1A",
        },
        success: "#1E9E5A",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
      },
      // Motion: short and calm. Always applied with Tailwind's `motion-safe:`
      // prefix, so users who ask for reduced motion get none.
      keyframes: {
        enter: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { opacity: "0", transform: "scale(0.6)" },
          "70%": { opacity: "1", transform: "scale(1.06)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        enter: "enter 220ms ease-out both",
        pop: "pop 320ms ease-out both",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.08)",
      },
      fontSize: {
        display: ["28px", { lineHeight: "34px", fontWeight: "700" }],
        title: ["20px", { lineHeight: "26px", fontWeight: "600" }],
        body: ["15px", { lineHeight: "22px", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};
