import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover, var(--card))",
          foreground: "var(--popover-foreground, var(--card-foreground))",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted, var(--secondary))",
          foreground: "var(--muted-foreground, var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "var(--accent, var(--primary))",
          foreground: "var(--accent-foreground, var(--primary-foreground))",
        },
        destructive: {
          DEFAULT: "var(--destructive, #ef4444)",
          foreground: "var(--destructive-foreground, white)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        info: {
          DEFAULT: "var(--info)",
          foreground: "var(--info-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1, #10b981)",
          "2": "var(--chart-2, #3b82f6)",
          "3": "var(--chart-3, #8b5cf6)",
          "4": "var(--chart-4, #ef4444)",
          "5": "var(--chart-5, #f59e0b)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background, var(--background))",
          foreground: "var(--sidebar-foreground, var(--foreground))",
          primary: "var(--sidebar-primary, var(--primary))",
          "primary-foreground": "var(--sidebar-primary-foreground, var(--primary-foreground))",
          accent: "var(--sidebar-accent, var(--accent))",
          "accent-foreground": "var(--sidebar-accent-foreground, var(--accent-foreground))",
          border: "var(--sidebar-border, var(--border))",
          ring: "var(--sidebar-ring, var(--ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;