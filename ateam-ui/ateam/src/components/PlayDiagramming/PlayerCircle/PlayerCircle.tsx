import Konva from "konva";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Circle } from "react-konva";
import PlayLine from "@/components/PlayDiagramming/PlayLine/PlayLine";
import {
    LineData,
    Point,
    LineToDraw,
    Connector,
    PlayerCircleData,
} from "../Common/types";
import { useDiagramContext } from "../Context/DiagramContext";

import { readyException } from "jquery";
import { handleAddLine, playerDragProcessing } from ".";

const PLAYER_CIRCLE_RADIUS = 25;

export default function PlayerCircle({
    animating,
    layer,
    playerCircleData,
}: {
    animating: boolean | null;
    layer: RefObject<Konva.Layer | null>;
    playerCircleData: PlayerCircleData;
}) {
    const { state, dispatch } = useDiagramContext();

    const onCircleSelect = () => {
        dispatch({
            type: "DESELECT_ALL",
        });
        dispatch({
            type: "SELECT_PLAYER",
            payload: { playerId: playerCircleData.id },
        });
    };

    const initialOrigin = useRef<Point>(playerCircleData.origin);

    const handlePlayerDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
        console.log("handlePlayerDrag");
        const newEnd = e.target.position();
        playerDragProcessing(state, dispatch, playerCircleData, newEnd);
        initialOrigin.current = newEnd;
    };

    // const animatePlayer = () => {
    //     if (!layer.current) {
    //         return;
    //         // If there are no lines
    //     } else if (playerCircleData?.connector?.childId == null) {
    //         return;
    //     }
    //     let t = 0;
    //     let childId = playerCircleData?.connector?.childId;
    //     const anim = new Konva.Animation((frame) => {
    //         if (frame) {
    //             const timeDelta = frame.timeDiff / 1000; // Control speed here
    //             t += timeDelta * 1; // Adjust time step to control speed of the animation
    //             if (t > 1) {
    //                 t = 1;
    //                 anim.stop();
    //                 //
    //                 setTimeout(
    //                     () =>
    //                         dispatch({
    //                             type: "UPDATE_PLAYER",
    //                             payload: {
    //                                 id: playerCircleData.id,
    //                                 updates: {
    //                                     origin: initialOrigin.current,
    //                                 },
    //                             },
    //                         }),
    //                     1000
    //                 ); // Reset after 1 second
    //             }

    //             const line = playerCircleData.lines.get(childId);
    //             if (line != undefined) {
    //                 // Bezier interpolation formula for quadratic curves
    //                 const x =
    //                     (1 - t) * (1 - t) * initialOrigin.current.x +
    //                     2 * (1 - t) * t * line.control.x +
    //                     t * t * line.end.x;
    //                 const y =
    //                     (1 - t) * (1 - t) * initialOrigin.current.y +
    //                     2 * (1 - t) * t * line.control.y +
    //                     t * t * line.end.y;
    //                 dispatch({
    //                     type: "UPDATE_PLAYER",
    //                     payload: {
    //                         id: playerCircleData.id,
    //                         updates: {
    //                             origin: { x, y },
    //                         },
    //                     },
    //                 });
    //             } else {
    //                 // TODO: use different exception?
    //                 throw new DOMException(
    //                     "Couldnt animate lines because line was undefined"
    //                 );
    //             }
    //         }
    //     }, layer.current);
    //     anim.start();
    // };
    const animatePlayer = (connector: Connector, parentOrigin: Point) => {
        console.log("animating player");

        if (!layer.current || !connector?.childId) {
            return;
        }

        let t = 0;
        const childId = connector.childId;
        const line = playerCircleData.lines.get(childId);

        if (!line) {
            console.error(
                `Line with ID ${childId} not found for playerCircleData ${playerCircleData.id}`
            );
            return;
        }
        console.log("test");

        const anim = new Konva.Animation((frame) => {
            if (frame) {
                const timeDelta = frame.timeDiff / 1000; // Control speed here
                t += timeDelta * 1; // Adjust time step to control speed of the animation
                if (t > 1) {
                    t = 1;
                    anim.stop();
                    // Recursively animate the child player
                    if (line.connector?.childId) {
                        console.log("animating second player");
                        animatePlayer(line.connector, line.end); // Pass the line's end point as the new parentOrigin
                    } else {
                        setTimeout(() => {
                            console.log("should bring back to origin");
                            dispatch({
                                type: "UPDATE_PLAYER",
                                payload: {
                                    id: playerCircleData.id,
                                    updates: {
                                        origin: initialOrigin.current,
                                    },
                                },
                            });
                        }, 1000);
                    }
                } else {
                    // Bezier interpolation formula for quadratic curves
                    const x =
                        (1 - t) * (1 - t) * parentOrigin.x +
                        2 * (1 - t) * t * line.control.x +
                        t * t * line.end.x;
                    const y =
                        (1 - t) * (1 - t) * parentOrigin.y +
                        2 * (1 - t) * t * line.control.y +
                        t * t * line.end.y;

                    dispatch({
                        type: "UPDATE_PLAYER",
                        payload: {
                            id: playerCircleData.id,
                            updates: {
                                origin: { x, y },
                            },
                        },
                    });
                }
            }
        }, layer.current);

        anim.start();
    };

    useEffect(() => {
        dispatch({
            type: "DESELECT_ALL",
        });
        handleAddLine(state, dispatch, playerCircleData);
    }, [state.lineToDraw]);

    useEffect(() => {
        if (animating) {
            if (playerCircleData.connector) {
                animatePlayer(
                    playerCircleData.connector,
                    initialOrigin.current
                );
            }
        }
    }, [animating]);

    return (
        <>
            {/* Note: layering in konva works by ordering of elements in code. We want the circle on top, so render lines first. */}
            {Array.from(playerCircleData.lines.values()).map((line) => {
                return <PlayLine key={line.id} lineData={line} />;
            })}
            <Circle
                id={playerCircleData.id}
                circleId={playerCircleData.id}
                x={playerCircleData.origin.x}
                y={playerCircleData.origin.y}
                radius={PLAYER_CIRCLE_RADIUS}
                fill={playerCircleData.fill}
                stroke={
                    playerCircleData.selected ? "black" : playerCircleData.fill
                }
                type="player-circle"
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
                onMouseDown={onCircleSelect}
            />
        </>
    );
}
