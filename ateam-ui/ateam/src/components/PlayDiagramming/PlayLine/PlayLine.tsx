import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Circle, Shape } from "react-konva";
import Konva from "konva";
import { Context } from "konva/lib/Context"; // Type for context
import { ControlPoint, LineData, Point, Connector } from "../Common/types";
import LineEnd from "@/components/PlayDiagramming/LineEnd/LineEnd";
import { Shape as KonvaShape } from "konva/lib/Shape"; // Type for shape
import {
    calculateLineEndAngle,
    getAnchorCoords,
    updatePositions,
    selectLine,
    controlPointDrag,
    lineEndDrag,
} from ".";
import { useDiagramContext } from "../Context/DiagramContext";

export default function PlayLine({
    lineData: lineData,
}: {
    lineData: LineData;
}) {
    const { state, dispatch } = useDiagramContext();
    const initialControl = useRef<ControlPoint>(lineData.control);
    const initialOrigin = useRef<ControlPoint>(lineData.origin);

    // Handle drag movement of vertex A
    const handleEndDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const newEnd = e.target.position();
        lineEndDrag(dispatch, state, lineData, newEnd, initialOrigin.current);
    };

    const handleSelectLine = () => {
        dispatch({
            type: "DESELECT_ALL",
        });
        selectLine(dispatch, lineData);
    };

    const handleControlPointDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const controlPoint = { x: e.target.x(), y: e.target.y() };
        controlPointDrag(dispatch, state, lineData, controlPoint);
        initialControl.current = controlPoint;
    };

    useEffect(() => {
        if (lineData.origin != initialOrigin.current) {
            updatePositions(
                dispatch,
                lineData,
                lineData.origin,
                initialOrigin.current,
                false
            );
            initialOrigin.current = lineData.origin;
        }
    }, [lineData.origin]);

    return (
        <>
            <Shape
                id={lineData.id}
                circleId={lineData.circleId}
                stroke={lineData.fill}
                strokeWidth={2}
                type="move-line"
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
                onMouseDown={() => {
                    handleSelectLine();
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
                type="select-line"
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
                onMouseDown={() => {
                    handleSelectLine();
                }}
            />

            {/* Control point */}
            <Circle
                x={lineData.control.x}
                y={lineData.control.y}
                radius={5}
                fill={lineData.selected ? "red" : "transparent"}
                draggable
                type="line-control"
                onDragMove={(e) => {
                    handleControlPointDrag(e);
                }}
                onDragEnd={(e) => {
                    // console.log(initialControl);
                    // setLineData((prev) => ({
                    //     ...prev,
                    //     dragging: false,
                    // }));
                    // onLineChange(lineData);
                }}
                onMouseDown={() => {
                    handleSelectLine();
                }}
            />

            <LineEnd
                x={lineData.end.x}
                y={lineData.end.y}
                angle={90}
                fill={lineData.fill}
                stroke={"black"}
                rotation={lineData.lineEndAngle}
                selected={lineData.selected}
                lineId={lineData.id}
                circleId={lineData.circleId}
            />

            {/* End point */}
            <Circle
                x={lineData.end.x}
                y={lineData.end.y}
                radius={15}
                draggable
                type="line-end-circle"
                onDragMove={handleEndDrag}
                // onDragEnd={() => onLineChange(lineData)}
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
                onMouseDown={() => {
                    handleSelectLine();
                }}
            />
        </>
    );
}
