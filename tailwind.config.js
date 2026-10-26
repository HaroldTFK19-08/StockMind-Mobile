/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // Paleta institucional SENA
                sena: {
                    DEFAULT: "#39A900",
                    light: "#55C52A",
                    dark: "#2E8500",
                    soft: "#EAF6E3",
                },
                surface: "#F4F7F2",
                ink: "#172117",
            },
        },
    },
    plugins: [],
};
