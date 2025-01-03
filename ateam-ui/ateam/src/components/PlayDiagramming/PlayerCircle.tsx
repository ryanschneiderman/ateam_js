import Konva from "konva";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Circle } from "react-konva";
import DrawLine from "./DrawLine";
import { LineType, Point, DrawLineInfo, Connector } from "./types";
import { updateLineInMap, addLineToMap, isLine } from "./utilities";

import { readyException } from "jquery";

const PLAYER_CIRCLE_RADIUS = 25;

export default function PlayerCircle({
    animating,
    fill,
    x,
    y,
    layer,
    selected,
    selectedLine,
    id,
    drawLineInfo,
    onLineSelect,
    onCircleSelect,
}: {
    animating: boolean;
    fill: string;
    x: number;
    y: number;
    layer: RefObject<Konva.Layer | null>;
    selected: boolean;
    selectedLine: string | null;
    id: string;
    drawLineInfo: DrawLineInfo | null;
    onLineSelect: (lineId: string) => void;
    onCircleSelect: () => void;
}) {
    const [lines, setLines] = useState<Map<string, LineType>>(
        new Map<string, LineType>()
    );

    const [origin, setOrigin] = useState<Point>({ x, y });
    const initialOrigin = useRef<Point>(origin);
    const [rootConnector, setRootConnector] = useState<Connector>({
        parentId: id,
        childId: null,
    });

    const [currentSelectedLine, setCurrentSelectedLine] = useState<
        string | null
    >(null);

    const handlePlayerDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const newEnd = e.target.position();
        setOrigin(newEnd);
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
                    setTimeout(() => setOrigin(initialOrigin.current), 1000); // Reset after 1 second
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
                    setOrigin({ x, y });
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
        console.log(id);
        console.log(selected);
    }, [selected]);

    useEffect(() => {
        if (
            drawLineInfo != null &&
            drawLineInfo.coords != null &&
            drawLineInfo.selectedId != null
        ) {
            const { coords, selectedId } = drawLineInfo;
            console.log("printing drawLineInfo");
            console.log(drawLineInfo);

            setLines((prev) => {
                let newLineOrigin = origin;
                if (isLine(selectedId)) {
                    const line = lines.get(selectedId);
                    if (line && line.origin) {
                        newLineOrigin = line?.endAnchor;
                    }
                }
                let [updatedLines, newLine] = addLineToMap(
                    prev,
                    id,
                    newLineOrigin,
                    coords,
                    selectedId,
                    fill
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
    }, [drawLineInfo]);

    useEffect(() => {
        console.log("player circle line select change");
        if (selectedLine != null) {
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

            setCurrentSelectedLine(selectedLine);
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
    }, [selectedLine]);

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
                id={id}
                circleId={id}
                x={origin.x}
                y={origin.y}
                radius={PLAYER_CIRCLE_RADIUS}
                fill={fill}
                stroke={selected ? "black" : fill}
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
