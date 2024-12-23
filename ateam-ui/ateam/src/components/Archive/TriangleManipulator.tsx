import React, { useState } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import Konva from "konva";

interface Point {
    x: number;
    y: number;
}

const TriangleManipulator: React.FC = () => {
    const [A, setA] = useState<Point>({ x: 100, y: 150 });
    const [B, setB] = useState<Point>({ x: 300, y: 150 });
    const [C, setC] = useState<Point>({ x: 200, y: 100 });

    // Handle drag movement of vertex A
    const handleDragA = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const newA = e.target.position();
        console.log("moving A");
        updatePositions(newA, B, true); // Rotate around B
    };

    // Handle drag movement of vertex B
    const handleDragB = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const newB = e.target.position();
        console.log("moving B");
        updatePositions(newB, A, false); // Rotate around A
    };

    // General function to update positions
    const updatePositions = (
        newPoint: Point,
        pivot: Point,
        movingA: boolean
    ) => {
        // Determine which point is being moved and update it
        const fixedPoint = movingA ? B : A;
        const movingPoint = movingA ? A : B;
        const updateMovingPoint = movingA ? setA : setB;

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
            (C.x - fixedPoint.x) * Math.cos(angleDelta) * scale -
            (C.y - fixedPoint.y) * Math.sin(angleDelta) * scale;
        const newCy =
            fixedPoint.y +
            (C.x - fixedPoint.x) * Math.sin(angleDelta) * scale +
            (C.y - fixedPoint.y) * Math.cos(angleDelta) * scale;

        // Update state
        updateMovingPoint(newPoint);
        setC({ x: newCx, y: newCy });
    };

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Line
                    points={[A.x, A.y, C.x, C.y, B.x, B.y]}
                    stroke="black"
                    strokeWidth={2}
                    closed
                />
                <Circle
                    x={A.x}
                    y={A.y}
                    radius={10}
                    fill="red"
                    draggable
                    onDragMove={handleDragA}
                />
                <Circle
                    x={B.x}
                    y={B.y}
                    radius={10}
                    fill="blue"
                    draggable
                    onDragMove={handleDragB}
                />
                <Circle
                    x={C.x}
                    y={C.y}
                    radius={10}
                    fill="green"
                    draggable={false}
                />
            </Layer>
        </Stage>
    );
};

export default TriangleManipulator;
