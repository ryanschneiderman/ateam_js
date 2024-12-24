import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Circle, Shape } from "react-konva";
import Konva from "konva";
import { Context } from "konva/lib/Context"; // Type for context
import { ControlPoint, LineType, Point, Connector } from "./types";
import LineEnd from "@/components/PlayDiagramming/LineEnd";
import { Shape as KonvaShape } from "konva/lib/Shape"; // Type for shape
// import { Line } from "konva/lib/shapes/Line";

export default function DrawLine({
    onLineChange,
    lineData: lLineData,
}: {
    onLineChange: (line: LineType) => void;
    lineData: LineType;
}) {
    const [lineData, setLineData] = useState<LineType>(lLineData);
    const initialControl = useRef<ControlPoint>(lineData.control);
    const initialOrigin = useRef<ControlPoint>(lineData.origin);

    const [lineEndAngle, setLineEndAngle] = useState<number>(0);

    // Handle drag movement of vertex A
    const handleEndDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const newEnd = e.target.position();
        updatePositions(newEnd, true); // Rotate around B
    };

    // Handle drag movement of vertex A
    const handleOriginDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const newOrigin = e.target.position();
        updatePositions(newOrigin, false); // Rotate around B
    };

    // General function to update positions
    const updatePositions = (newPoint: Point, movingEnd: boolean) => {
        // Determine which point is being moved and update it
        const fixedPoint = movingEnd ? initialOrigin.current : lineData.end;
        const movingPoint = movingEnd ? lineData.end : initialOrigin.current;

        // Calculate rotation angle
        const originalAngle = Math.atan2(
            movingPoint.y - fixedPoint.y,
            movingPoint.x - fixedPoint.x
        );

        const newAngle = Math.atan2(
            newPoint.y - fixedPoint.y,
            newPoint.x - fixedPoint.x
        );
        const angleDelta = newAngle - originalAngle;

        // Calculate scaling factor
        const originalDistance = Math.sqrt(
            (movingPoint.x - fixedPoint.x) ** 2 +
                (movingPoint.y - fixedPoint.y) ** 2
        );

        const newDistance = Math.sqrt(
            (newPoint.x - fixedPoint.x) ** 2 + (newPoint.y - fixedPoint.y) ** 2
        );

        const scale = newDistance / originalDistance;

        // Apply rotation and scaling to C
        const newCx =
            fixedPoint.x +
            (lineData.control.x - fixedPoint.x) * Math.cos(angleDelta) * scale -
            (lineData.control.y - fixedPoint.y) * Math.sin(angleDelta) * scale;
        const newCy =
            fixedPoint.y +
            (lineData.control.x - fixedPoint.x) * Math.sin(angleDelta) * scale +
            (lineData.control.y - fixedPoint.y) * Math.cos(angleDelta) * scale;
        // Update state
        setLineData((prev) => ({
            ...prev,
            control: { x: newCx, y: newCy },
            end: movingEnd ? newPoint : prev.end,
        }));
        setAnchorAngle();
    };

    const setAnchorAngle = () => {
        // Calculate changes in x and y from the derivative formula at t = 1
        const deltaX = lineData.end.x - lineData.control.x;
        const deltaY = lineData.end.y - lineData.control.y;

        // atan2 returns the angle in radians and we convert it to degrees
        // Adding 90 degrees to rotate the triangle to make its base perpendicular
        const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90;
        setLineEndAngle(angle);
        return angle;
    };

    interface Point {
        x: number;
        y: number;
    }

    useEffect(() => {
        if (lLineData.origin != initialOrigin.current) {
            setLineData(lLineData);
            setAnchorAngle();
            updatePositions(lineData.origin, false);

            initialOrigin.current = lineData.origin;
            onLineChange(lineData);
        }
    }, [lLineData.origin]);

    useEffect(() => {
        setAnchorAngle();
    });

    return (
        <>
            <Shape
                stroke={lineData.fill}
                strokeWidth={2}
                sceneFunc={(ctx: Context, shape: KonvaShape) => {
                    ctx.beginPath();
                    ctx.moveTo(lineData.origin.x, lineData.origin.y);
                    ctx.quadraticCurveTo(
                        lineData.control.x,
                        lineData.control.y,
                        lineData.end.x,
                        lineData.end.y
                    );
                    ctx.fillStrokeShape(shape);
                }}
            />

            <Line
                points={[
                    lineData.origin.x,
                    lineData.origin.y,
                    lineData.end.x,
                    lineData.end.y,
                ]}
                stroke={lineData.fill}
                strokeWidth={1}
                dash={[5, 5]}
            />

            <Line
                points={[
                    lineData.origin.x,
                    lineData.origin.y,
                    lineData.control.x,
                    lineData.control.y,
                ]}
                stroke="grey"
                dash={[5, 5]}
            />
            <Line
                points={[
                    lineData.end.x,
                    lineData.end.y,
                    lineData.control.x,
                    lineData.control.y,
                ]}
                stroke="grey"
                dash={[5, 5]}
            />

            {/* Control point */}
            <Circle
                x={lineData.control.x}
                y={lineData.control.y}
                radius={5}
                fill="red"
                draggable
                onDragMove={(e) => {
                    setLineData((prev) => ({
                        ...prev,
                        control: { x: e.target.x(), y: e.target.y() },
                        dragging: true,
                    }));
                    initialControl.current = {
                        x: e.target.x(),
                        y: e.target.y(),
                    };
                    setAnchorAngle();
                }}
                onDragEnd={(e) => {
                    // Update initial control when manually moved

                    // console.log(initialControl);
                    setLineData((prev) => ({
                        ...prev,
                        dragging: false,
                    }));
                    onLineChange(lineData);
                }}
            />

            <LineEnd
                x={lineData.end.x}
                y={lineData.end.y}
                angle={90}
                fill={lineData.fill}
                stroke={"black"}
                rotation={lineEndAngle}
            />

            {/* End point */}
            <Circle
                x={lineData.end.x}
                y={lineData.end.y}
                radius={5}
                draggable
                onDragMove={handleEndDrag}
                onDragEnd={() => onLineChange(lineData)}
            />
        </>
    );
}
