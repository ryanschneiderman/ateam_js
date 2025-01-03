import PlayerCircle from "@/components/PlayDiagramming/PlayerCircle";
import Konva from "konva";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { Layer, Stage, useStrictMode } from "react-konva";
import { updateCircleInMap } from "./utilities";
import { CircleData, Point } from "./types";
import React from "react";

const DEFAULT_Y_PLAYER_SPACING = 65;
const DEFAULT_Y_OFFSET = 50;
export default function Index() {
    const layerRef = useRef<Konva.Layer>(null); // Ensure it's typed if using TypeScript
    const [animating, setAnimating] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedParentCircleId, setSelectedParentCircleId] = useState<
        string | null
    >(null);
    const [isDrawingLine, setIsDrawingLine] = useState(false);

    const [playerCircles, setPlayerCircles] = useState<Map<string, CircleData>>(
        new Map<string, CircleData>(
            Array.from({ length: 5 }, (_, i) => {
                const id = `circle-${i}`;
                return [
                    id,
                    {
                        key: i,
                        selected: false,
                        selectedLine: null,
                        x: 40,
                        y: i * DEFAULT_Y_PLAYER_SPACING + DEFAULT_Y_OFFSET,
                        ref: React.createRef(),
                        fill: "#005bff",
                        drawLineInfo: null,
                    },
                ];
            })
        )
    );

    const updateCircle = (circleId: string, newData: Partial<CircleData>) => {
        setPlayerCircles((prevCircles) => {
            const newCircles = new Map(prevCircles); // Create a new Map for immutability
            const circle = newCircles.get(circleId);
            if (circle) {
                newCircles.set(circleId, { ...circle, ...newData }); // Update the specific circle
            }
            return newCircles;
        });
    };

    const handleStageClick = (e: any) => {
        if (selectedParentCircleId) {
            deselectPlayerLine(selectedParentCircleId);
        }

        if (
            isDrawingLine &&
            selectedId != null &&
            selectedParentCircleId != null
        ) {
            console.log("should be drawing line");
            const { x, y } = e.target.getStage().getPointerPosition();
            const coords: Point = {
                x: x,
                y: y,
            };
            updateCircle(selectedParentCircleId, {
                drawLineInfo: { coords, selectedId: selectedId },
            });
            setIsDrawingLine(false); // Reset line drawing mode
        }
    };

    const deselectPlayerLine = (selectedId: string) => {
        setPlayerCircles((prev) => {
            const updatedCircles = updateCircleInMap(prev, selectedId, {
                selected: false,
                selectedLine: null,
            });
            return updatedCircles;
        });
    };

    const handleSelection = (circleId: string, lineId: string | null) => {
        if (lineId != null) {
            setPlayerCircles((prev) => {
                const updatedCircles = updateCircleInMap(prev, circleId, {
                    selectedLine: lineId,
                });
                return updatedCircles;
            });
            setSelectedId(lineId);
            setSelectedParentCircleId(circleId);
        } else {
            setPlayerCircles((prev) => {
                const updatedCircles = updateCircleInMap(prev, circleId, {
                    selected: true,
                });
                return updatedCircles;
            });
            setSelectedId(circleId);
            setSelectedParentCircleId(circleId);
        }
    };

    return (
        <>
            <div>
                <button
                    className={`p-2 m-2 border-2 ${
                        animating ? "border-black" : ""
                    }`}
                    onMouseDown={() => {
                        setAnimating(true);
                    }}
                    onMouseUp={() => setAnimating(false)}
                >
                    Animate Lines
                </button>
                <div>
                    <button
                        className={`p-2 m-2 border-2 ${
                            isDrawingLine ? "border-black" : ""
                        }`}
                        onClick={() => setIsDrawingLine(true)}
                    >
                        Draw Line
                    </button>
                </div>

                <Stage
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onPointerDown={handleStageClick}
                >
                    <Layer ref={layerRef}>
                        {Array.from(playerCircles.values()).map((circle, i) => (
                            <PlayerCircle
                                key={`circle-${i}`}
                                id={`circle-${i}`} // Assign a unique ID
                                animating={animating}
                                fill={circle.fill}
                                layer={layerRef}
                                x={circle.x}
                                y={circle.y}
                                selected={circle.selected}
                                selectedLine={circle.selectedLine}
                                drawLineInfo={circle.drawLineInfo}
                                onLineSelect={(selectedLineId) => {
                                    handleSelection(
                                        `circle-${i}`,
                                        selectedLineId
                                    );
                                }}
                                onCircleSelect={() => {
                                    handleSelection(`circle-${i}`, null);
                                }}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </>
    );
}
