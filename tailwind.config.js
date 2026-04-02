/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#161B23",
        teal: "#58B3A1",
        safe: "#7BC59D",
        warning: "#D4A45B",
        critical: "#CD6D67",
        surface: "#202732",
        panel: "#2A3442"
      },
      boxShadow: {
        card: "0 24px 60px rgba(5, 9, 14, 0.36)"
      },
      backgroundImage: {
        "app-gradient":
          "radial-gradient(circle at 12% 10%, rgba(88,179,161,0.11), transparent 24%), radial-gradient(circle at 82% 14%, rgba(92,132,178,0.09), transparent 24%), linear-gradient(180deg, #0c1117 0%, #161d27 54%, #10161e 100%)"
      },
      fontFamily: {
        sans: ["Manrope", "Poppins", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
