import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // Grand Design Visual 2025 - Star Wars Theme
        "sith-red": "#951518", // Merah Tua (Sith)
        "space-dark": "#1D222F", // Biru Sangat Tua (Luar Angkasa)
        "sand-gold": "#D1A56E", // Emas Pudar (Pasir)
        "vader-black": "#201D20", // Hitam (Darth Vader)
        "lightsaber-yellow": "#E3C45E", // Kuning Terang (Lightsaber)
        "r2d2-blue": "#5D9FAF", // Biru Muda (R2-D2)
        "xwing-orange": "#E16E4B", // Oranye (X-Wing)
        "mace-purple": "#A16DA8", // Ungu (Mace Windu)
        "cyan-saber": "#2BCAE0", // Cyan (Lightsaber)
        "neutral-cream": "#F5EAD9", // Krem (Latar Belakang Netral)
        "metallic-gray": "#848A9D", // Abu-abu (Metalik)
        "yoda-green": "#6FC36D", // Hijau (Yoda)
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        "death-star": "var(--font-death-star)", // 1. DEATH STAR REGULAR - Judul Utama (H1)
        "helvetica-black": "var(--font-helvetica-black)", // 2. HELVETICA BLACK ORIGINAL - Sub-Judul (H2)
        "atures": "var(--font-atures)", // 3. Atures 900 - Heading Alternatif (H3)
        "trade-gothic": "var(--font-trade-gothic)", // 4. Trade Gothic Bold #2 - Body Text & Button
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
