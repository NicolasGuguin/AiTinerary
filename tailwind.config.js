export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F1A',
        text: '#F1F5F9',
        primary: '#F43F5E',      
        secondary: '#FDBA74',    
        card: '#141A2A',        
        alert: '#FACC15'        
      }
      ,
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif']
      }
    }
  },
  plugins: [],
}
