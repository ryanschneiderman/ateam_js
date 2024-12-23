import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Circle, Shape } from "react-konva";
import Konva from "konva";
import { Context } from "konva/lib/Context"; // Type for context
import { ControlPoint, LineType, Point, Connector } from "./types";
import LineEnd from "@/components/PlayDiagramming/LineEnd";
import { Shape as KonvaShape } from "konva/lib/Shape"; // Type for shape
// import { Line } from "konva/lib/shapes/Line";

export default function DrawLine({
    id,
    circleId,
    origin,
    control: lControl,
    end: lEnd,
    onLineChange,
    fill,
    selected,
    connector,
    lineData: lLineData,
}: {
    id: string;
    circleId: string;
    origin: Point;
    control: Point;
    end: Point;
    onLineChange: (line: LineType) => void;
    fill: string;
    selected: boolean;
    connector: Connector | null;
    lineData: LineType;
}) {
    // const [origin, setOrigin] = useState<Point>(lOrigin);
    const [control, setControl] = useState<ControlPoint>(lControl);
    const [end, setEnd] = useState<Point>(lEnd);

    const [lineData, setLineData] = useState<LineType>(lLineData);

    const initialControl = useRef<ControlPoint>(control);
    const initialOrigin = useRef<ControlPoint>(origin);

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
        console.log("updating positions");
        // Determine which point is being moved and update it
        const fixedPoint = movingEnd ? initialOrigin.current : end;
        const movingPoint = movingEnd ? end : initialOrigin.current;

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
            (control.x - fixedPoint.x) * Math.cos(angleDelta) * scale -
            (control.y - fixedPoint.y) * Math.sin(angleDelta) * scale;
        const newCy =
            fixedPoint.y +
            (control.x - fixedPoint.x) * Math.sin(angleDelta) * scale +
            (control.y - fixedPoint.y) * Math.cos(angleDelta) * scale;

        // Update state
        if (movingEnd) setEnd(newPoint);
        setControl({ x: newCx, y: newCy });
        setAnchorAngle();
    };

    const setAnchorAngle = () => {
        // Calculate changes in x and y from the derivative formula at t = 1
        const deltaX = end.x - control.x;
        const deltaY = end.y - control.y;

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
        updatePositions(origin, false);
        onLineChange({
            id,
            circleId,
            origin,
            control,
            end,
            fill,
            selected,
            connector,
        });
        initialOrigin.current = origin;
    }, [origin]);

    return (
        <>
            <Shape
                stroke={fill}
                strokeWidth={2}
                sceneFunc={(ctx: Context, shape: KonvaShape) => {
                    ctx.beginPath();
                    ctx.moveTo(origin.x, origin.y);
                    ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
                    ctx.fillStrokeShape(shape);
                }}
            />

            <Line
                points={[origin.x, origin.y, end.x, end.y]}
                stroke={fill}
                strokeWidth={1}
                dash={[5, 5]}
                // tension={0.5}
                // bezier={true}
            />

            <Line
                points={[origin.x, origin.y, control.x, control.y]}
                stroke="grey"
                dash={[5, 5]}
            />
            <Line
                points={[end.x, end.y, control.x, control.y]}
                stroke="grey"
                dash={[5, 5]}
            />

            {/* Control point */}
            <Circle
                x={control.x}
                y={control.y}
                radius={5}
                fill="red"
                draggable
                onDragMove={(e) => {
                    setControl({
                        x: e.target.x(),
                        y: e.target.y(),
                        dragging: true,
                    });
                    initialControl.current = {
                        x: e.target.x(),
                        y: e.target.y(),
                    };
                    setAnchorAngle();
                }}
                onDragEnd={(e) => {
                    // Update initial control when manually moved

                    // console.log(initialControl);
                    setControl((prev) => ({
                        ...prev,
                        dragging: false,
                    }));
                    onLineChange({
                        id,
                        origin,
                        control,
                        end,
                        fill,
                        selected,
                    } as LineType);
                }}
            />

            <LineEnd
                x={end.x}
                y={end.y}
                angle={90}
                fill={fill}
                stroke={"black"}
                rotation={lineEndAngle}
            />

            {/* End point */}
            <Circle
                x={end.x}
                y={end.y}
                radius={5}
                draggable
                onDragMove={handleEndDrag}
                onDragEnd={() =>
                    onLineChange({
                        id,
                        circleId,
                        origin,
                        control,
                        end,
                        fill,
                        selected,
                        connector,
                    })
                }
            />
        </>
    );
}
