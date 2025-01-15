import React from "react";
import { DiagramProvider } from "../Context/DiagramContext";
import { RefObject, useEffect } from "react";
import PlayerCircle from "../PlayerCircle/PlayerCircle";
import { LineData, Point, Connector, PlayerCircleData } from "../Common/types";
import Konva from "konva";
import { Layer, Stage, useStrictMode } from "react-konva";
import { useRef, useState } from "react";
import { useDiagramContext } from "../Context/DiagramContext";

export default function Diagram() {
    const { state, dispatch } = useDiagramContext();
    const layerRef = useRef<Konva.Layer>(null);

    const handleStageClick = (e: any) => {
        const objectClicked = e.target.attrs;
        if (
            state.drawLineSelected &&
            state.selectedId != null &&
            state.selectedParentCircleId != null
        ) {
            const { x, y } = e.target.getStage().getPointerPosition();
            const coords: Point = {
                x: x,
                y: y,
            };
            dispatch({
                type: "UPDATE_PLAYER",
                payload: {
                    id: state.selectedParentCircleId,
                    updates: {
                        lineToDraw: coords,
                    },
                },
            });
            dispatch({
                type: "SET_DRAWLINE_SELECTED",
                payload: { set: false },
            });
        } else if (objectClicked.type == "canvas") {
            dispatch({
                type: "SET_DRAWLINE_SELECTED",
                payload: { set: false },
            });
            dispatch({
                type: "DESELECT_ALL",
            });
        }
    };

    return (
        <>
            <div>
                <button
                    className={`p-2 m-2 border-2 ${
                        state.animating ? "border-black" : ""
                    }`}
                    onMouseDown={() => {
                        dispatch({ type: "ANIMATE_PLAY" });
                    }}
                    onMouseUp={() => {
                        dispatch({ type: "STOP_ANIMATION" });
                    }}
                >
                    Animate Lines
                </button>
                <div>
                    <button
                        className={`p-2 m-2 border-2 ${
                            state.drawLineSelected ? "border-black" : ""
                        }`}
                        onClick={() => {
                            dispatch({
                                type: "SET_DRAWLINE_SELECTED",
                                payload: { set: true },
                            });
                        }}
                    >
                        Draw Line
                    </button>
                </div>

                <Stage
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onPointerDown={handleStageClick}
                    type="canvas"
                >
                    <Layer ref={layerRef}>
                        {Array.from(state.players.values()).map((circle, i) => (
                            <PlayerCircle
                                key={circle.key}
                                playerCircleData={circle}
                                animating={state.animating}
                                layer={layerRef}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </>
    );
}
