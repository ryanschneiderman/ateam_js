import React, { useRef, useState, useEffect } from "react";
import { Parallax, useParallax } from "react-scroll-parallax";

const StatParallax: React.FC<StatParallaxProps> = ({
    statName,
    initialValue,
    initialX,
    initialY,
    textColor,
    shadowColor,
}) => {
    // State to hold the current display value
    const [currentValue, setCurrentValue] = useState(initialValue);
    const [highlight, setHighlight] = useState(false);

    const triggerTextEffect = () => {
        setHighlight(true);
        setTimeout(() => {
            setHighlight(false);
        }, 1000); // duration of the text effect
    };

    const parallax = useParallax<HTMLHeadingElement>({
        translateY: [`${initialY}px`, `${initialY}px`],
        translateX: [`${initialX}px`, `${initialX}px`],
        onProgressChange: (progress) => {
            // Assuming you want to increment initialValue based on progress
            const newValue = initialValue + Math.floor(progress * 5); // Example calculation
            if (newValue !== currentValue) {
                setCurrentValue(newValue);
                triggerTextEffect();
            }
            setCurrentValue(newValue);
        },
    });

    return (
        <div ref={parallax.ref} className={`text-2xl font-semibold flex `}>
            <div
                className={`pr-4 transition duration-500 ${
                    highlight ? "text-white" : "text-slate-400"
                }`}
            >
                {statName}
            </div>
            <div
                className={` ${textColor} transition-[text-shadow] duration-500 ease-in-out ${
                    highlight ? `text-shadow ${shadowColor}` : ""
                }`}
            >
                {currentValue}
            </div>
        </div>
    );
};

export default StatParallax;
