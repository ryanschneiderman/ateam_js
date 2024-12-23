// StatsSection.tsx
import React, { CSSProperties, useRef, useEffect, useState } from "react";
import PageSectionDescription from "../PageSectionDescription";
import { Parallax, useParallax } from "react-scroll-parallax";
import StatParallax from "./StatParallax";

const descriptionElements: string[] = [
    "Customize stats you want to keep for your team.",
    "Shot charts for players and team.",
    "Game and period box scores",
    "Submit at end of game to accumulate to season stats.",
];

const customStyle: CSSProperties = {
    borderRadius: "10px",
};

const statParallaxConfig: StatParallaxProps[] = [
    {
        statName: "Assists",
        initialValue: 3,
        initialX: 0.75,
        initialY: -0.8,
        textColor: "text-ateam-statgrid-orange",
        shadowColor: "shadow-ateam-statgrid-orange",
    },
    {
        statName: "Offensive Rebounds",
        initialValue: 2,
        initialX: 0.8,
        initialY: -0.75,
        textColor: "text-ateam-statgrid-purple",
        shadowColor: "shadow-ateam-statgrid-purple",
    },
    {
        statName: "Points",
        initialValue: 9,
        initialX: 0.65,
        initialY: -0.7,
        textColor: "text-ateam-statgrid-blue",
        shadowColor: "shadow-ateam-statgrid-blue",
    },
    {
        statName: "Turnovers",
        initialValue: 2,
        initialX: 0.75,
        initialY: -0.65,
        textColor: "text-ateam-statgrid-yellow",
        shadowColor: "shadow-ateam-statgrid-yellow",
    },
    {
        statName: "Steals",
        initialValue: 1,
        initialX: 0.67,
        initialY: -0.57,
        textColor: "text-ateam-statgrid-green",
        shadowColor: "shadow-ateam-statgrid-green",
    },
    {
        statName: "Blocks",
        initialValue: 0,
        initialX: 0.87,
        initialY: -0.55,
        textColor: "text-ateam-statgrid-teal",
        shadowColor: "shadow-ateam-statgrid-teal",
    },
    {
        statName: "Defensive Rebounds",
        initialValue: 0,
        initialX: 0.7,
        initialY: -0.47,
        textColor: "text-ateam-statgrid-red",
        shadowColor: "shadow-ateam-statgrid-red",
    },
];

const titleElements: string[] = ["Stat collection made easy."];

// Define the component using forwardRef
const StatsSection = React.forwardRef<HTMLDivElement, StatsSectionProps>(
    (props, ref) => {
        // You can destructure props directly in the parameter list
        const { top } = props;
        console.log("STAT TOP: " + top);
        const dotGridRef = useRef<HTMLDivElement>(null);
        const [statGridHeight, setStatGridHeight] = useState(0);
        const [statGridWidth, setStatGridWidth] = useState(0);
        useEffect(() => {
            const updatePosition = () => {
                if (dotGridRef.current) {
                    const height =
                        dotGridRef.current.getBoundingClientRect().height;
                    const width =
                        dotGridRef.current.getBoundingClientRect().width;
                    setStatGridHeight(height);
                    setStatGridWidth(width);
                }
            };
            updatePosition();
            console.log("statGridHeight: " + statGridHeight);
        });
        return (
            <Parallax opacity={[0, 1]} startScroll={top} endScroll={top + 500}>
                <div ref={ref} className={"pt-64 bg-neutral-900 relative"}>
                    <div
                        ref={dotGridRef}
                        className={"pt-16 bg-microdot-grid pb-40"}
                    >
                        <PageSectionDescription
                            title={titleElements}
                            description="Track stats for your team during games with ATeam Game Mode for in game insights, or afterward with film."
                            listItems={descriptionElements}
                            buttonLink="/learn-more-stats"
                            buttonLabel="Learn More About Stat Collection"
                            className="stats-section"
                            fontColor="text-white"
                            backgroundColor="bg-neutral-700"
                            width="w-[44vw]"
                            style={customStyle}
                        />
                    </div>
                    <div className="absolute">
                        {statParallaxConfig.map((item, key) => (
                            <StatParallax
                                statName={item.statName}
                                initialValue={item.initialValue}
                                initialX={statGridWidth * item.initialX}
                                initialY={statGridHeight * item.initialY}
                                textColor={item.textColor}
                                shadowColor={item.textColor}
                                key={key}
                            />
                        ))}
                    </div>
                </div>
            </Parallax>
        );
    }
);

export default StatsSection;
