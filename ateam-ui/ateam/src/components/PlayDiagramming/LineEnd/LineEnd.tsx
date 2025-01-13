import React, { useState, useEffect } from "react";
import { Circle, RegularPolygon } from "react-konva";
import { useDiagramContext } from "../Context/DiagramContext";

export default function LineEnd({
    x,
    y,
    angle,
    fill,
    rotation,
    stroke,
    selected,
    lineId,
    circleId,
}: {
    x: number;
    y: number;
    angle: number;
    fill: string;
    rotation: number;
    stroke: string;
    selected: boolean;
    lineId: string;
    circleId: string;
}) {
    const { state, dispatch } = useDiagramContext();
    // TODO: eventually move this to the DrawLine component
    const calculateOffsets = (x: number, y: number, rotation: number) => {
        console.log("in offsets");
        console.log({ x: x, y: y, rotation: rotation });
        const offsetDistance = 12;
        const theta = ((rotation - angle) * Math.PI) / 180;
        const xOffset = x + offsetDistance * Math.cos(theta);
        const yOffset = y + offsetDistance * Math.sin(theta);
        return { xOffset, yOffset };
    };

    const { xOffset: initialXOffset, yOffset: initialYOffset } =
        calculateOffsets(x, y, rotation);

    const [xOffset, setXOffset] = useState<number>(initialXOffset);
    const [yOffset, setYOffset] = useState<number>(initialYOffset);

    const setLineEndAnchor = () => {
        const { xOffset, yOffset } = calculateOffsets(x, y, rotation);
        setXOffset(xOffset);
        setYOffset(yOffset);
        console.log("in line end!");
        console.log({ x: xOffset, y: yOffset });
    };

    const handleLineEndSelect = () => {
        dispatch({
            type: "SELECT_LINE",
            payload: {
                lineId: lineId,
                playerId: circleId,
            },
        });
    };

    useEffect(() => {
        setLineEndAnchor();
    }, [x, y, rotation]);

    return (
        <>
            {/* End point */}
            <RegularPolygon
                sides={3}
                x={x}
                y={y}
                radius={5}
                stroke={stroke}
                strokeWidth={1}
                rotation={rotation}
                fill={fill}
                onClick={() => {
                    handleLineEndSelect();
                }}
                type="line-end-triangle"
            />
            {/* Anchor Point */}
            <Circle
                x={xOffset}
                y={yOffset}
                radius={3}
                fill={selected ? fill : "transparent"}
                stroke={selected ? fill : "transparent"}
                strokeWidth={1}
                type="line-end-anchor"
                onClick={() => {
                    handleLineEndSelect();
                }}
            />
        </>
    );
}
