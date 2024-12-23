import React from "react";
import PageSectionDescription from "../PageSectionDescription";
import CourtSvg from "./CourtSvg";

const descriptionElements: string[] = [
    "Separate plays into progressions for increased readability.",
    "Animate progressions to visualize movement.",
    "Annotate plays for precise direction.",
    "Categorize plays in a dynamic library.",
];
const titleElements: string[] = [
    "Clear the Whiteboard.",
    "Play diagramming has changed.",
];
const arcStartX = -422;
const arcStartY = 750;
const arcEndX = 733;
const arcEndY = arcStartY;
const arcXRadius = 577.5;
const arcYRadius = 538.75;
const arcLineLength = 150;
const circleRadius = 165;

const PlaysSection = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
    return (
        <div
            style={{ background: "linear-gradient(#ffeee6 0%, #ffffff 100%)" }}
            className="flex"
            ref={ref}
        >
            <div className="flex-1">
                <CourtSvg
                    arcStartX={arcStartX}
                    arcStartY={arcStartY}
                    arcEndX={arcEndX}
                    arcEndY={arcEndY}
                    arcXRadius={arcXRadius}
                    arcYRadius={arcYRadius}
                    arcLineLength={arcLineLength}
                    circleRadius={circleRadius}
                />
            </div>
            <div className="flex-1">
                <PageSectionDescription
                    title={titleElements}
                    description="ATeam play diagramming makes it easy to build plays and share them with your players. A messy whiteboard is a thing of the past."
                    listItems={descriptionElements}
                    buttonLink="/learn-more-plays"
                    buttonLabel="LEARN MORE ABOUT PLAYS"
                    className="plays-section"
                    fontColor="text-ateam-dark-grey"
                />
            </div>
        </div>
    );
});

PlaysSection.displayName = "PlaysSection";

export default PlaysSection;
