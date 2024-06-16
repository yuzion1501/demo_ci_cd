/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,jsx}",
        "./components/**/*.{js,jsx}",
        "./app/**/*.{js,jsx}",
        "./src/**/*.{js,jsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            fontFamily: {
                sans: ['"Lexend"', "sans-serif"],
            },
            backgroundImage: {
                "linear-gradient":
                    "linear-gradient(269.85deg, #54151C 0%, #121212 54.89%)",
                "linear-gradient-different":
                    "linear-gradient(180deg, rgba(255, 223, 223, 0) 29.86%, #FFF6F6 100%)",
                "itviec-different":
                    "url('https://itviec.com/assets/employer_landing/round-7b576a08f59ea555667c691a6bb1de728b3bd9d8c2f9b137a24976fbc3825aa9.svg')",
                "linear-gradient-hight-value":
                    "linear-gradient(180deg, #680000 25.23%, #121212 100%)",
                "linear-gradient-content":
                    " linear-gradient(180deg, #FFE0E0 0%, rgba(255, 192, 192, 0) 100%);",
                "linear-gradient-content-x":
                    " linear-gradient(90deg, #FFE0E0 0%, rgba(255, 192, 192, 0) 100%);",
                "itviec-top-emp":
                    "url('https://itviec.com/assets/employer_landing/top-employer-bg-164b5f70bc68259732cfb92075898a08aee0c77e38f24cb689d68fb33b3c80f6.svg')",
                "linear-gradient-logo":
                    "linear-gradient(161deg, #54151C 0%, #121212 100%)",
                "itviec-register-employer":
                    "url('https://tuyendung.topcv.vn/app/_nuxt/img/image-nhan-dien-thuong-hieu.89c9cc5.svg')",
            },
            backgroundPosition: {
                bottom: "bottom",
                "center-center": "center center",
            },
            height: {
                "vh-main": "calc(100vh - 417px)",
                "vh-employer-login": "calc(100vh - 88px)",
            },
            minHeight: {
                128: "50rem",
            },
        },
    },
    variants: {
        extend: {
            backgroundPosition: ["responsive"],
        },
    },
    plugins: [require("tailwindcss-animate")],
};
