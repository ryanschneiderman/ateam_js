import Konva from "konva";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Circle } from "react-konva";
import DrawLine from "./DrawLine";
import { LineType, Point, DrawLineInfo, Connector } from "./types";
import { updateLineInMap, addLineToMap, isLine } from "./utilities";

import { readyException } from "jquery";

const PLAYER_CIRCLE_RADIUS = 20;

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
    onMouseDown,
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
    onMouseDown: () => void;
}) {
    // const [lines, setLines] = useState<LineType[]>([]);
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
            const childId = rootConnector.childId;
            setLines((prev) => {
                const updatedLines = updateLineInMap(prev, childId, {
                    origin: newEnd,
                });
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
        if (
            drawLineInfo != null &&
            drawLineInfo.coords != null &&
            drawLineInfo.selectedId != null
        ) {
            const { coords, selectedId } = drawLineInfo;

            setLines((prev) => {
                let [updatedLines, newLineId] = addLineToMap(
                    prev,
                    id,
                    origin,
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
                            childId: newLineId, // Update only the childId property
                        },
                    });
                } else {
                    setRootConnector((prev) => ({
                        ...prev, // Preserve all existing properties of rootConnector
                        childId: newLineId, // Update only the childId property
                    }));
                }
                console.log(updatedLines);
                return updatedLines;
            });
        }
    }, [drawLineInfo]);

    useEffect(() => {
        if (selectedLine != null) {
            setLines((prev) => {
                let updatedLines = updateLineInMap(prev, selectedLine, {
                    selected: true,
                });
                if (currentSelectedLine != null) {
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
    }, [selectedLine, currentSelectedLine]);

    useEffect(() => {
        if (animating) {
            animatePlayer();
        }
    }, [animating]);

    return (
        <>
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
                onMouseDown={onMouseDown}
            />
            {Array.from(lines.values()).map((line) => (
                <DrawLine
                    key={line.id}
                    {...line}
                    lineData={line}
                    // consider changing this function to propagate line changes
                    onLineChange={(updatedLine) => {
                        setLines((prev) => {
                            const newLines = new Map(prev);
                            newLines.set(updatedLine.id, updatedLine); // Update the specific line in the map
                            return newLines;
                        });
                    }}
                />
            ))}
        </>
    );
}
