import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";

// Define the extended type for control point
interface ControlPoint {
    x: number;
    y: number;
    dragging?: boolean;
}

const BezierInteractive = () => {
    const [controlPoint, setControlPoint] = useState<ControlPoint>({
        x: 150,
        y: 100,
    });
    const [startPoint, setStartPoint] = useState({ x: 50, y: 200 });
    const [endPoint, setEndPoint] = useState({ x: 250, y: 200 });
    const initialControl = useRef<ControlPoint>({ x: 150, y: 100 });

    const weight = 2;

    useEffect(() => {
        // Recalculate control point based on start and end points unless it's being dragged
        if (!controlPoint.dragging) {
            setControlPoint({
                x:
                    (initialControl.current.x * weight +
                        startPoint.x +
                        endPoint.x) /
                    (2 + weight),
                y:
                    (initialControl.current.y * weight +
                        startPoint.y +
                        endPoint.y) /
                    (2 + weight),
            });
        }
    }, [startPoint, endPoint]); // Effect runs on start or end point change

    // Calculate the visual offset of the control point
    const controlPointInfluence = controlPoint; // Directly use controlPoint for simplicity

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                {/* The Bezier curve */}
                <Line
                    points={[
                        startPoint.x,
                        startPoint.y,
                        controlPointInfluence.x,
                        controlPointInfluence.y,
                        endPoint.x,
                        endPoint.y,
                    ]}
                    stroke="black"
                    strokeWidth={2}
                    lineCap="round"
                    tension={0.5}
                    bezier={true}
                />
                {/* Visual connection lines */}
                <Line
                    points={[
                        startPoint.x,
                        startPoint.y,
                        controlPoint.x,
                        controlPoint.y,
                    ]}
                    stroke="grey"
                    dash={[5, 5]}
                />
                <Line
                    points={[
                        endPoint.x,
                        endPoint.y,
                        controlPoint.x,
                        controlPoint.y,
                    ]}
                    stroke="grey"
                    dash={[5, 5]}
                />

                {/* Control point */}
                <Circle
                    x={controlPoint.x}
                    y={controlPoint.y}
                    radius={5}
                    fill="red"
                    draggable
                    onDragMove={(e) => {
                        console.log("TEST");
                        setControlPoint({
                            x: e.target.x(),
                            y: e.target.y(),
                            dragging: true,
                        });
                        initialControl.current = {
                            x: e.target.x(),
                            y: e.target.y(),
                        };
                    }}
                    onDragEnd={(e) => {
                        // Update initial control when manually moved

                        console.log(initialControl);
                        setControlPoint((prev) => ({
                            ...prev,
                            dragging: false,
                        }));
                    }}
                />

                {/* Start point */}
                <Circle
                    x={startPoint.x}
                    y={startPoint.y}
                    radius={5}
                    fill="green"
                    draggable
                    onDragMove={(e) => {
                        setStartPoint({ x: e.target.x(), y: e.target.y() });
                    }}
                />
                {/* End point */}
                <Circle
                    x={endPoint.x}
                    y={endPoint.y}
                    radius={5}
                    fill="green"
                    draggable
                    onDragMove={(e) => {
                        setEndPoint({ x: e.target.x(), y: e.target.y() });
                    }}
                />
            </Layer>
        </Stage>
    );
};

export default BezierInteractive;
