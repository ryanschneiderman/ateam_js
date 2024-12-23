import React, { useState, useEffect } from "react";
import { Playfair_Display, Montserrat } from "next/font/google";

interface TextPair {
    main: string;
    sub: string;
}
interface RotatingTextProps {
    currentText: TextPair;
    fade: boolean;
}

const playfairDisplay = Playfair_Display({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});

const montserrat = Montserrat({
    weight: "700",
    subsets: ["latin"],
    display: "swap",
});

const RotatingText: React.FC<RotatingTextProps> = ({ currentText, fade }) => {
    // const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fade = true;
        }, 500);

        return () => clearTimeout(timeout);
    }, [currentText]);

    return (
        <div className={`flex flex-col justify-center items-center h-screen`}>
            <h1
                className={`text-8xl text-white ml-40 mr-40 transition-opacity ${
                    playfairDisplay.className
                } duration-500 ${fade ? "opacity-100" : "opacity-0"}`}
            >
                {currentText.main}
            </h1>
            <p
                className={`text-xl mt-8 mb-8 text-white ${
                    montserrat.className
                } transition-opacity duration-500 ${
                    fade ? "opacity-100" : "opacity-0"
                }`}
            >
                {currentText.sub}
            </p>
        </div>
    );
};

export default RotatingText;
