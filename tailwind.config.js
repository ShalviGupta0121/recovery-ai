/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B1F3A",
        teal: "#00C2A8",
        safe: "#46C789",
        warning: "#F4B740",
        critical: "#E25858",
        surface: "#102847",
        panel: "#122D52"
      },
      boxShadow: {
        card: "0 20px 45px rgba(5, 15, 31, 0.18)"
      },
      backgroundImage: {
        "app-gradient":
          "radial-gradient(circle at top, rgba(0,194,168,0.14), transparent 28%), linear-gradient(180deg, #08172e 0%, #0d2342 100%)"
      },
      fontFamily: {
        sans: ["Manrope", "Poppins", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
