import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Circle, Shape } from "react-konva";
import Konva from "konva";
import { Context } from "konva/lib/Context"; // Type for context
import { ControlPoint, LineType, Point, Connector } from "./types";
import LineEnd from "@/components/PlayDiagramming/LineEnd";
import { Shape as KonvaShape } from "konva/lib/Shape"; // Type for shape
import { calculateLineEndAngle, getAnchorCoords } from "./utilities";

// import { Line } from "konva/lib/shapes/Line";

export default function DrawLine({
    onLineChange,
    onLineSelect,
    onLineDrag,
    lineData: lLineData,
}: {
    onLineSelect: (lineId: string) => void;
    onLineDrag: (lineId: string) => void;
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
        onLineDrag(lineData.id);
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

        const controlPoint = { x: newCx, y: newCy };
        const angle = calculateLineEndAngle(newPoint, controlPoint);
        const anchorCoords = getAnchorCoords(newPoint.x, newPoint.y, angle, 90);
        console.log("printing anchor coords");
        console.log(anchorCoords);
        // Update state
        setLineData((prev) => ({
            ...prev,
            control: controlPoint,
            end: movingEnd ? newPoint : prev.end,
            endAnchor: movingEnd ? anchorCoords : prev.endAnchor,
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

    const selectLine = () => {
        setLineData((prev) => ({
            ...prev,
            selected: true,
        }));
        onLineChange(lineData);
    };

    useEffect(() => {
        onLineChange(lineData);
    }, [lineData.end]);

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
        setLineData(lLineData);
    }, [lLineData.selected]);

    useEffect(() => {
        setAnchorAngle();
    });

    return (
        <>
            <Shape
                id={lineData.id}
                circleId={lineData.circleId}
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
                onMouseEnter={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) {
                        container.style.cursor = "pointer";
                    }
                }}
                onMouseLeave={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) {
                        container.style.cursor = "default";
                    }
                }}
                onClick={() => {
                    onLineSelect(lineData.id);
                }}
            />

            <Line
                id={lineData.id}
                circleId={lineData.circleId}
                points={[
                    lineData.origin.x,
                    lineData.origin.y,
                    lineData.end.x,
                    lineData.end.y,
                ]}
                stroke="transparent"
                strokeWidth={20}
                dash={[5, 5]}
                onMouseEnter={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) {
                        container.style.cursor = "pointer";
                    }
                }}
                onMouseLeave={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) {
                        container.style.cursor = "default";
                    }
                }}
                onClick={() => {
                    onLineSelect(lineData.id);
                }}
            />

            <Line
                points={[
                    lineData.origin.x,
                    lineData.origin.y,
                    lineData.control.x,
                    lineData.control.y,
                ]}
                stroke="transparent"
                dash={[5, 5]}
                strokeWidth={1}
            />
            <Line
                points={[
                    lineData.end.x,
                    lineData.end.y,
                    lineData.control.x,
                    lineData.control.y,
                ]}
                stroke="transparent"
                strokeWidth={1}
                dash={[5, 5]}
            />

            {/* Control point */}
            <Circle
                x={lineData.control.x}
                y={lineData.control.y}
                radius={5}
                fill={lineData.selected ? "red" : "transparent"}
                draggable
                onDragMove={(e) => {
                    const control = { x: e.target.x(), y: e.target.y() };
                    const angle = calculateLineEndAngle(lineData.end, control);
                    const anchorCoords = getAnchorCoords(
                        lineData.end.x,
                        lineData.end.y,
                        angle,
                        90
                    );
                    setLineData((prev) => ({
                        ...prev,
                        control: control,
                        endAnchor: anchorCoords,
                        dragging: true,
                    }));
                    initialControl.current = control;
                    setAnchorAngle();
                    onLineDrag(lineData.id);
                    // onLineChange(lineData);
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
                onMouseDown={() => {
                    onLineSelect(lineData.id);
                }}
            />

            <LineEnd
                x={lineData.end.x}
                y={lineData.end.y}
                angle={90}
                fill={lineData.fill}
                stroke={"black"}
                rotation={lineEndAngle}
                selected={lineData.selected}
                onLineEndSelect={() => {
                    onLineSelect(lineData.id);
                }}
            />

            {/* End point */}
            <Circle
                x={lineData.end.x}
                y={lineData.end.y}
                radius={15}
                draggable
                onDragMove={handleEndDrag}
                onDragEnd={() => onLineChange(lineData)}
                onMouseEnter={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) {
                        container.style.cursor = "move";
                    }
                }}
                onMouseLeave={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) {
                        container.style.cursor = "default";
                    }
                }}
                onClick={() => {
                    onLineSelect(lineData.id);
                }}
            />
        </>
    );
}
