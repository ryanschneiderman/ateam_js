import {
    LineData,
    Point,
    LineToDraw,
    Connector,
    PlayerCircleData,
} from "../Common/types";
import {
    calculateLineEndAngle,
    getAnchorCoords,
    isLine,
} from "../Common/utilities";
// helpers/diagramHelpers.ts
import { DiagramAction, DiagramState } from "../Context/DiagramContext";

/**
 * Creates a new line object
 * @param circleId The ID of the circle to associate with the line.
 * @param origin The origin point of the line.
 * @param coords The end point of the line.
 * @param parentId The parent ID for the connector.
 * @param fill The fill color of the line.
 * @returns A new line
 */
export const createLineObj = (
    id: string,
    circleId: string,
    origin: Point,
    coords: Point,
    parentId: string,
    fill: string
): LineData => {
    const lineId = id;
    const control = {
        x: (origin.x + coords.x) / 2,
        y: (origin.y + coords.y) / 2,
    };
    const angle = calculateLineEndAngle(coords, control);
    const anchorCoords = getAnchorCoords(coords.x, coords.y, angle, 90);
    const newLine: LineData = {
        id: lineId,
        circleId,
        origin,
        control: control,
        end: coords,
        endAnchor: anchorCoords,
        fill,
        connector: { parentId, childId: null },
        selected: true,
        lineEndAngle: angle,
    };
    return newLine;
};

export const handleAddLine = (
    state: DiagramState,
    dispatch: React.Dispatch<DiagramAction>,
    playerCircleData: PlayerCircleData
) => {
    let newLineOrigin = null;
    let newLineId = null;
    let parentId = null;
    if (
        state.selectedId != null &&
        state.lineToDraw != null &&
        state.lineToDraw.coords
    ) {
        if (state.selectedParentCircleId) {
            const player = state.players.get(state.selectedParentCircleId);
            if (player != null) {
                newLineId = `line-${player.lines.size}`;
                newLineOrigin = player.origin;
                if (isLine(state.selectedId)) {
                    const parentLine = player.lines.get(state.selectedId);
                    if (parentLine && parentLine.origin) {
                        newLineOrigin = parentLine?.endAnchor;
                        parentId = parentLine.id;
                        dispatch({
                            type: "UPDATE_LINE",
                            payload: {
                                playerId: player.id,
                                lineId: parentLine.id,
                                updates: {
                                    selected: false,
                                    connector: {
                                        parentId: parentId,
                                        childId: newLineId,
                                    },
                                },
                            },
                        });
                    }
                } else {
                    parentId = player.id;
                    dispatch({
                        type: "UPDATE_PLAYER",
                        payload: {
                            id: player.id,
                            updates: {
                                connector: {
                                    parentId: null,
                                    childId: newLineId,
                                },
                            },
                        },
                    });
                }
                if (parentId != null) {
                    const newLine: LineData = createLineObj(
                        newLineId,
                        player.id,
                        newLineOrigin,
                        state.lineToDraw.coords,
                        parentId,
                        player.fill
                    );
                    dispatch({
                        type: "ADD_LINE",
                        payload: { playerId: player.id, line: newLine },
                    });
                    dispatch({
                        type: "SET_SELECTED_LINE",
                        payload: { playerId: player.id, lineId: newLineId },
                    });
                }
            }
        }
    }
};

export const playerDragProcessing = (
    state: DiagramState,
    dispatch: React.Dispatch<DiagramAction>,
    playerCircleData: PlayerCircleData,
    newEnd: Point
) => {
    dispatch({
        type: "UPDATE_PLAYER",
        payload: {
            id: playerCircleData.id,
            updates: {
                origin: newEnd,
            },
        },
    });
    if (playerCircleData.connector?.childId != null) {
        const childId = playerCircleData.connector?.childId;
        dispatch({
            type: "UPDATE_LINE",
            payload: {
                lineId: childId,
                playerId: playerCircleData.id,
                updates: {
                    origin: newEnd,
                },
            },
        });
    }
};
