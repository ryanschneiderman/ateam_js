import React from "react";
import PlayerPiece from "./PlayerPiece";

const CourtSvg: React.FC<CourtSvgProps> = ({
    arcStartX,
    arcStartY,
    arcEndX,
    arcEndY,
    arcXRadius,
    arcYRadius,
    arcLineLength,
    circleRadius,
}) => {
    const circleCenterY = arcStartY - arcYRadius + circleRadius; // Adjusting to place the circle just touching the top of the arc
    const circleCenterX = (arcStartX + arcEndX) / 2;
    const paintHeight = arcYRadius + arcLineLength - circleRadius + 100;
    const paintWidth = circleRadius * 2;
    const paintStartY = arcStartY - arcYRadius + circleRadius;
    const svgWidth = 1155;
    const svgHeight = 900;
    const playerMapConfig: PlayerPieceProps[] = [
        {
            fill: "red",
            stroke: "#FF6060",
            translateX: [25, 75],
            translateY: [`${svgHeight / 10}px`, `${svgHeight / 4}px`],
            speed: 10,
            startScroll: 100,
            endScroll: 900,
        },
        {
            fill: "red",
            stroke: "#FF6060",
            translateX: [`${svgWidth / 3}px`, `${svgWidth / 1.5}px`],
            translateY: [`${svgHeight / 1.2}px`, `${svgHeight / 1.2}px`],
            speed: -5,
            startScroll: 100,
            endScroll: 900,
        },
        {
            fill: "#3C70FD",
            stroke: "#6F96FF",
            translateX: [`${svgWidth / 6}px`, `${svgWidth / 3}px`],
            translateY: [`${svgHeight / 3.5}px`, `${svgHeight / 2.5}px`],
            speed: -3,
            startScroll: 100,
            endScroll: 900,
        },
        {
            fill: "#3C70FD",
            stroke: "#6F96FF",
            translateX: [`${svgWidth / 3.8}px`, `${svgWidth / 2.6}px`],
            translateY: [`${svgHeight / 1.6}px`, `${svgHeight / 1.4}px`],
            speed: -5,
            startScroll: 100,
            endScroll: 900,
        },
        {
            fill: "#3C70FD",
            stroke: "#6F96FF",
            translateX: [`${svgWidth / 8}px`, `${svgWidth / 6}px`],
            translateY: [`${svgHeight / 1.2}px`, `${svgHeight / 1.4}px`],
            speed: -5,
            startScroll: 100,
            endScroll: 900,
        },
    ];
    return (
        <div className="grid grid-cols-1 relative">
            {playerMapConfig.map((item, key) => (
                <PlayerPiece
                    fill={item.fill}
                    stroke={item.stroke}
                    translateX={item.translateX}
                    translateY={item.translateY}
                    speed={item.speed}
                    startScroll={item.startScroll}
                    endScroll={item.endScroll}
                    key={key}
                />
            ))}

            <svg
                width={svgWidth}
                height={svgHeight}
                xmlns="http://www.w3.org/2000/svg"
                overflow="hidden"
                className=""
            >
                <defs>
                    <filter id="dropshadow" height="130%" width="130%">
                        <feGaussianBlur
                            in="SourceAlpha"
                            stdDeviation="3"
                        ></feGaussianBlur>
                        <feOffset dx="2" dy="3" result="offsetblur"></feOffset>
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.4"></feFuncA>
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode></feMergeNode>
                            <feMergeNode in="SourceGraphic"></feMergeNode>
                        </feMerge>
                    </filter>
                </defs>
                {/* 3 point arc */}
                <path
                    d={`M ${arcStartX},${arcStartY} A ${arcXRadius},${arcYRadius} 0 0 1 ${arcEndX},${arcEndY}`}
                    fill="none"
                    stroke="black"
                    strokeWidth="8"
                />
                {/* Vertical line extending downward from the end of the arc for 150 pixels */}
                <line
                    x1={arcEndX}
                    y1={arcEndY}
                    x2={arcEndX}
                    y2={arcLineLength + arcEndY}
                    stroke="black"
                    strokeWidth="8"
                />
                {/* Circle centered on the arc */}
                <circle
                    cx={circleCenterX}
                    cy={circleCenterY}
                    r={circleRadius}
                    fill="none"
                    stroke="black"
                    strokeWidth="8"
                />
                {/* Paint */}
                <rect
                    x={circleCenterX - circleRadius}
                    y={paintStartY}
                    width={paintWidth}
                    height={paintHeight}
                    fill="none"
                    stroke="black"
                    strokeWidth="8"
                />
            </svg>
        </div>
    );
};

export default CourtSvg;
