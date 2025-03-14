module.exports = {
  mode : 'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./src/views/pages/landing-page/LandingPage.jsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: "#FFD700",
        secondary: "#FFA500",
        tertiary: "#FF6347",
        quaternary: "#FF4500",
        quinary: "#FF0000",
        senary: "#DC143C",
        septenary: "#B22222",
        octonary: "#8B0000",
        nonary: "#800000",
        denary: "#A52A2A",
        light: "#F0F0F0",
        dark: "#333333",
      },
      spacing: {
        35: '8.75rem',
        72: '18rem',
        84: '21rem',
        96: '24rem',
      },
    }
  },
  plugins: [],
}
// Muốn sử dụng tất cả thì 
// npx tailwindcss -i index.css -o build/index.css
