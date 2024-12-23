import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Circle, RegularPolygon } from "react-konva";
import Konva from "konva";
import { ControlPoint, LineType, Point } from "./types";

export default function LineEnd({
    x,
    y,
    angle,
    fill,
    rotation,
    stroke,
}: {
    x: number;
    y: number;
    angle: number;
    fill: string;
    rotation: number;
    stroke: string;
}) {
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
            />
        </>
    );
}
