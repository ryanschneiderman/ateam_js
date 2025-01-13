import PlayerCircle from "@/components/PlayDiagramming/PlayerCircle";
import PlayLine from "@/components/PlayDiagramming/PlayLine";
import Konva from "konva";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { Layer, Stage, useStrictMode } from "react-konva";
import { updateCircleInMap } from "./utilities";
import { CircleData, Point, PlayerCircleData, LineData } from "./types";
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

    // const [state, setState] = useState({
    //     players: new Map<string, PlayerCircleData>(),
    //     selectedId: null, // Tracks the currently selected player or line
    //   });

    // const [playerCircles, setState] = useState<Map<string, CircleData>>(
    //     new Map<string, CircleData>(
    //         Array.from({ length: 5 }, (_, i) => {
    //             const id = `circle-${i}`;
    //             return [
    //                 id,
    //                 {
    //                     key: i,
    //                     selected: false,
    //                     selectedLine: null,
    //                     x: 40,
    //                     y: i * DEFAULT_Y_PLAYER_SPACING + DEFAULT_Y_OFFSET,
    //                     ref: React.createRef(),
    //                     fill: "#005bff",
    //                     lineToDraw: null,
    //                 },
    //             ];
    //         })
    //     )
    // );

    const [state, setState] = useState<Map<string, PlayerCircleData>>(
        new Map<string, PlayerCircleData>(
            Array.from({ length: 5 }, (_, i) => {
                const id = `circle-${i}`;
                return [
                    id,
                    {
                        id: id,
                        key: i,
                        selected: false,
                        selectedLine: null,
                        origin: {
                            x: 40,
                            y: i * DEFAULT_Y_PLAYER_SPACING + DEFAULT_Y_OFFSET,
                        },
                        ref: React.createRef(),
                        fill: "#005bff",
                        lineToDraw: null,
                        lines: new Map<string, LineData>(),
                    },
                ];
            })
        )
    );

    const updateCircle = (circleId: string, newData: Partial<CircleData>) => {
        setState((prevState) => {
            const newCircles = new Map(prevState); // Create a new Map for immutability
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
                lineToDraw: { coords, selectedId: selectedId },
            });
            setIsDrawingLine(false); // Reset line drawing mode
        }
    };

    const deselectPlayerLine = (selectedId: string) => {
        setState((prev) => {
            const updatedCircles = updateCircleInMap(prev, selectedId, {
                selected: false,
                selectedLine: null,
            });
            return updatedCircles;
        });
    };

    const handleSelection = (circleId: string, lineId: string | null) => {
        if (lineId != null) {
            setState((prev) => {
                const updatedCircles = updateCircleInMap(prev, circleId, {
                    selectedLine: lineId,
                });
                return updatedCircles;
            });
            setSelectedId(lineId);
            setSelectedParentCircleId(circleId);
        } else {
            setState((prev) => {
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
                        {Array.from(state.values()).map((circle, i) => (
                            <PlayerCircle
                                playerCircleData={circle}
                                // key={circle.key}
                                // id={circle.id} // Assign a unique ID
                                animating={animating}
                                layer={layerRef}
                                // selected={circle.selected}
                                // selectedLine={circle.selectedLine}
                                // lineToDraw={circle.lineToDraw}
                                onLineSelect={(selectedLineId) => {
                                    handleSelection(
                                        `circle-${i}`,
                                        selectedLineId
                                    );
                                }}
                                onCircleSelect={() => {
                                    handleSelection(`circle-${i}`, null);
                                }}
                                onUpdate={(updatedPlayer) =>
                                    setState((prev) => {
                                        const newPlayers = new Map(prev);
                                        newPlayers.set(
                                            updatedPlayer.id,
                                            updatedPlayer
                                        );
                                        return { ...prev, players: newPlayers };
                                    })
                                }
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </>
    );
}
