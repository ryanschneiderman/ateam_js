import Konva from "konva";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Circle } from "react-konva";
import DrawLine from "./DrawLine";
import {
    LineData,
    Point,
    LineToDraw,
    Connector,
    PlayerCircleData,
} from "./types";
import { updateLineInMap, addLineToMap, isLine } from "./utilities";

import { readyException } from "jquery";

const PLAYER_CIRCLE_RADIUS = 25;

export default function PlayerCircle({
    animating,
    layer,
    playerCircleData,
    onLineSelect,
    onCircleSelect,
    onUpdate,
}: {
    animating: boolean;
    layer: RefObject<Konva.Layer | null>;
    playerCircleData: PlayerCircleData;
    onLineSelect: (lineId: string) => void;
    onCircleSelect: () => void;
    onUpdate: (playerCircleData: PlayerCircleData) => void;
}) {
    const [lines, setLines] = useState<Map<string, LineData>>(
        new Map<string, LineData>()
    );

    const initialOrigin = useRef<Point>(playerCircleData.origin);
    const [localOrigin, setLocalOrigin] = useState<Point>(
        playerCircleData.origin
    );
    const [rootConnector, setRootConnector] = useState<Connector>({
        parentId: playerCircleData.id,
        childId: null,
    });

    const [currentSelectedLine, setCurrentSelectedLine] = useState<
        string | null
    >(null);

    const handlePlayerDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const newEnd = e.target.position();
        // TODO: need to setState
        // setOrigin(newEnd);
        initialOrigin.current = e.target.position();
        if (rootConnector.childId != null) {
            console.log("root connector not null");
            const childId = rootConnector.childId;
            setLines((prev) => {
                const updatedLines = updateLineInMap(prev, childId, {
                    origin: newEnd,
                });
                return updatedLines;
            });
        }
    };

    const handleLineUpdate = (lineId: string, updates: Partial<LineData>) => {
        const updatedLines = new Map(playerCircleData.lines);
        const line = updatedLines.get(lineId);
        if (line) {
            updatedLines.set(lineId, { ...line, ...updates });
        }
        onUpdate({ ...playerCircleData, lines: updatedLines });
    };

    const handleLineDrag = (lineId: string) => {
        const line = lines.get(lineId);
        if (
            line != null &&
            line.connector != null &&
            line.connector.childId != null
        ) {
            console.log("line connector not null");
            const childId = line.connector.childId;
            console.log(childId);
            setLines((prev) => {
                const updatedLines = updateLineInMap(prev, childId, {
                    origin: line.endAnchor,
                });
                console.log(updatedLines);
                return updatedLines;
            });
        }
    };

    const animatePlayer = () => {
        if (!layer.current) {
            console.log("Layer is not available.");
            return;
            // If there are no lines
        } else if (rootConnector.childId == null) {
            return;
        }
        let t = 0;
        let childId = rootConnector.childId;
        const anim = new Konva.Animation((frame) => {
            if (frame) {
                const timeDelta = frame.timeDiff / 1000; // Control speed here
                t += timeDelta * 1; // Adjust time step to control speed of the animation
                if (t > 1) {
                    t = 1;
                    anim.stop();
                    //
                    setTimeout(
                        () => setLocalOrigin(initialOrigin.current),
                        1000
                    ); // Reset after 1 second
                }

                const line = lines.get(childId);
                if (line != undefined) {
                    // Bezier interpolation formula for quadratic curves
                    const x =
                        (1 - t) * (1 - t) * initialOrigin.current.x +
                        2 * (1 - t) * t * line.control.x +
                        t * t * line.end.x;
                    const y =
                        (1 - t) * (1 - t) * initialOrigin.current.y +
                        2 * (1 - t) * t * line.control.y +
                        t * t * line.end.y;
                    setLocalOrigin({ x, y });
                } else {
                    // TODO: use different exception?
                    throw new DOMException(
                        "Couldnt animate lines because line was undefined"
                    );
                }
            }
        }, layer.current);
        anim.start();
    };

    useEffect(() => {
        console.log(playerCircleData.id);
        console.log(playerCircleData.selected);
    }, [playerCircleData.selected]);

    useEffect(() => {
        if (
            playerCircleData.lineToDraw != null &&
            playerCircleData.lineToDraw.coords != null &&
            playerCircleData.lineToDraw.selectedId != null
        ) {
            const { coords, selectedId } = playerCircleData.lineToDraw;

            setLines((prev) => {
                let newLineOrigin = playerCircleData.origin;
                if (isLine(selectedId)) {
                    const line = lines.get(selectedId);
                    if (line && line.origin) {
                        newLineOrigin = line?.endAnchor;
                    }
                }
                let [updatedLines, newLine] = addLineToMap(
                    prev,
                    playerCircleData.id,
                    newLineOrigin,
                    coords,
                    selectedId,
                    playerCircleData.fill
                );

                if (selectedId != null && isLine(selectedId)) {
                    updatedLines = updateLineInMap(updatedLines, selectedId, {
                        selected: false,
                        connector: {
                            parentId:
                                prev.get(selectedId)?.connector?.parentId ??
                                null, // Ensure parentId is string | null
                            childId: newLine.id, // Update only the childId property
                        },
                    });
                } else {
                    setRootConnector((prev) => ({
                        ...prev, // Preserve all existing properties of rootConnector
                        childId: newLine.id, // Update only the childId property
                    }));
                }
                onLineSelect(newLine.id);
                return updatedLines;
            });
        }
    }, [playerCircleData.lineToDraw]);

    useEffect(() => {
        console.log("player circle line select change");
        if (playerCircleData.selectedLine != null) {
            const selectedLine = playerCircleData.selectedLine;
            setLines((prev) => {
                let updatedLines = updateLineInMap(prev, selectedLine, {
                    selected: true,
                });
                if (currentSelectedLine != null) {
                    console.log("is this it");
                    updatedLines = updateLineInMap(
                        updatedLines,
                        currentSelectedLine,
                        {
                            selected: false,
                        }
                    );
                }

                return updatedLines;
            });

            setCurrentSelectedLine(playerCircleData.selectedLine);
        }
        // unselect line
        else {
            console.log("should be deselecting line");
            if (currentSelectedLine != null) {
                setLines((prev) => {
                    let updatedLines = updateLineInMap(
                        prev,
                        currentSelectedLine,
                        {
                            selected: false,
                        }
                    );
                    setCurrentSelectedLine(null);

                    return updatedLines;
                });
                console.log(lines);
            } else {
                console.log("current selected line is null");
            }
        }
    }, [playerCircleData.selectedLine]);

    const deselectLines = () => {};

    useEffect(() => {
        if (animating) {
            animatePlayer();
        }
    }, [animating]);

    return (
        <>
            {/* Note: layering in konva works by ordering of elements in code. We want the circle on top, so render lines first. */}
            {Array.from(lines.values()).map((line) => {
                return (
                    <DrawLine
                        key={line.id}
                        lineData={line}
                        onLineChange={(updatedLine) => {
                            console.log("in callback");
                            setLines((prev) => {
                                const newLines = new Map(prev);
                                newLines.set(updatedLine.id, updatedLine); // Update the specific line in the map
                                return newLines;
                            });
                        }}
                        onLineDrag={(lineId) => {
                            handleLineDrag(lineId);
                        }}
                        onLineSelect={(lineId) => {
                            console.log("in drawline select callback");
                            deselectLines();
                            setLines((prev) => {
                                const updatedLines = updateLineInMap(
                                    prev,
                                    lineId,
                                    {
                                        selected: true,
                                    }
                                );
                                return updatedLines;
                            });
                            onLineSelect(lineId);
                        }}
                    />
                );
            })}
            <Circle
                id={playerCircleData.id}
                circleId={playerCircleData.id}
                x={localOrigin.x}
                y={localOrigin.y}
                radius={PLAYER_CIRCLE_RADIUS}
                fill={playerCircleData.fill}
                stroke={
                    playerCircleData.selected ? "black" : playerCircleData.fill
                }
                strokeWidth={3}
                draggable
                onDragMove={handlePlayerDrag}
                // onMouseDown={onMouseDown}
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
                onClick={onCircleSelect}
            />
        </>
    );
}
