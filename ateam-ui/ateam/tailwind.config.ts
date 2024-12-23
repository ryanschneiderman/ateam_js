import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";
const plugin = require("tailwindcss/plugin");

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "hero-pattern": "url('/img/hero-pattern.svg')",
                "microdot-grid": "url('/images/microdot-grid.png')",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                "ateam-orange": "#ff6c40",
                "ateam-dark-grey": "#333333",
                "ateam-pink": "#ff1053",
                "ateam-statgrid-orange": "#E67C00",
                "ateam-statgrid-purple": "#CF5BFA",
                "ateam-statgrid-blue": "#00A8E6",
                "ateam-statgrid-yellow": "#FFEF3C",
                "ateam-statgrid-green": "#0FBE00",
                "ateam-statgrid-teal": "#29F4E4",
                "ateam-statgrid-red": "#FF2467",
            },
            boxShadow: {
                "home-buttons": "0px 0px 3px #ff7a31",
            },
            fontFamily: {
                sans: ["helvetica"],
            },
            fontSize: {
                "text-xxl": "100px",
            },
            letterSpacing: {
                widest: ".2em",
            },
            textShadow: {
                sm: "0 1px 2px var(--tw-shadow-color)",
                DEFAULT: "0 0 8px var(--tw-shadow-color)",
                lg: "0 8px 16px var(--tw-shadow-color)",
            },
        },
    },
    plugins: [
        plugin(function ({ matchUtilities, theme }: PluginAPI) {
            matchUtilities(
                {
                    "text-shadow": (value) => ({
                        textShadow: value,
                    }),
                },
                { values: theme("textShadow") }
            );
        }),
    ],
};
export default config;
