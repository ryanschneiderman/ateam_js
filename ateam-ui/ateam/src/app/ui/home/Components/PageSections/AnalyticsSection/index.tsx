import React, { CSSProperties, useRef, useEffect, useState } from "react";
import PageSectionDescription from "../PageSectionDescription";
import { Parallax, useParallax } from "react-scroll-parallax";
import AnalyticsSvg from "./AnalyticsSvg";
// import CourtSvg from "./CourtSvg";

const descriptionElements: string[] = [
    "Track 25+ basic and advanced stats for players and team.",
    "Lineup insights, including best offensive and defensive.",
    "Game reports.",
    "Effective field goal percentage shot charts.",
];

const customStyle: CSSProperties = {
    borderRadius: "10px",
    paddingRight: "20px",
};
const titleElements: string[] = ["Pro level analytics meet the eye test."];

const AnalyticsSection = React.forwardRef<
    HTMLDivElement,
    AnalyticsSectionProps
>((props, ref) => {
    const { top } = props;
    return (
        <div className="bg-neutral-900">
            <Parallax opacity={[0, 1]} startScroll={top} endScroll={top + 750}>
                <div
                    style={{ background: "#0D1718" }}
                    className="flex pt-72 pb-48"
                    ref={ref}
                >
                    <div className="flex-1">
                        <AnalyticsSvg></AnalyticsSvg>
                    </div>
                    <div className="flex-1">
                        <PageSectionDescription
                            title={titleElements}
                            description="Gain next level insight with ATeam stat analytics. Track performance with basic and advanced stats. Explore different data visualizations. Make decisions with confidence."
                            listItems={descriptionElements}
                            buttonLink="/learn-more-analytics"
                            buttonLabel="Learn More About Analytics"
                            className="analytics-section"
                            fontColor="text-white"
                            backgroundColor="bg-neutral-700"
                            width="w-[40vw]"
                            style={customStyle}
                        />
                    </div>
                </div>
            </Parallax>
        </div>
    );
});

AnalyticsSection.displayName = "AnalyticsSection";

export default AnalyticsSection;
