import React from "react";
import { Parallax, useParallax } from "react-scroll-parallax";

const PlayerPiece: React.FC<PlayerPieceProps> = ({
    fill,
    stroke,
    translateX,
    translateY,
    speed,
    startScroll,
    endScroll,
}) => {
    return (
        <Parallax
            translateX={translateX}
            translateY={translateY}
            speed={speed}
            startScroll={startScroll}
            endScroll={endScroll}
        >
            <svg
                width={"6vw"}
                height={"6vw"}
                xmlns="http://www.w3.org/2000/svg"
                overflow="hidden"
                className="z-100 flex justify-center items-center absolute"
            >
                <circle
                    cx={"3vw"}
                    cy={"3vw"}
                    r="2.5vw"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={3}
                    filter="url(#dropshadow)"
                />
            </svg>
        </Parallax>
    );
};

export default PlayerPiece;
