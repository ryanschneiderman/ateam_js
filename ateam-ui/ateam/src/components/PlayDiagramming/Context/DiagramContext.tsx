import React, { createContext, useReducer, useContext } from "react";
import {
    LineData,
    Point,
    LineToDraw,
    Connector,
    PlayerCircleData,
} from "../Common/types";
import DrawLine from "@/components/Archive/OldComponents/DrawLine";

export interface DiagramState {
    players: Map<string, PlayerCircleData>;
    selectedId: string | null;
    selectedParentCircleId: string | null;
    animating: boolean | null;
    drawLineSelected: boolean | null;
    lineToDraw: LineToDraw | null;
}

const DEFAULT_Y_PLAYER_SPACING = 65;
const DEFAULT_Y_OFFSET = 50;

// Generate initial player data
const playerData = new Map<string, PlayerCircleData>(
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
                lines: new Map<string, LineData>(),
                connector: null,
            },
        ];
    })
);

// Initial state
const initialState: DiagramState = {
    players: playerData,
    selectedId: null,
    selectedParentCircleId: null,
    animating: false,
    drawLineSelected: null,
    lineToDraw: null,
};

export type DiagramAction =
    | { type: "ADD_PLAYER"; payload: PlayerCircleData }
    | {
          type: "UPDATE_PLAYER";
          payload: { id: string; updates: Partial<PlayerCircleData> };
      }
    | { type: "ADD_LINE"; payload: { playerId: string; line: LineData } }
    | {
          type: "UPDATE_LINE";
          payload: {
              playerId: string;
              lineId: string;
              updates: Partial<LineData>;
          };
      }
    | {
          type: "SET_SELECTED_LINE";
          payload: { playerId: string; lineId: string };
      }
    | { type: "SELECT_LINE"; payload: { lineId: string; playerId: string } }
    | { type: "SELECT_PLAYER"; payload: { playerId: string } }
    | { type: "DESELECT_ALL" }
    | { type: "ANIMATE_PLAY" }
    | { type: "STOP_ANIMATION" }
    | { type: "SET_DRAWLINE_SELECTED"; payload: { set: boolean } }
    | { type: "SET_LINE_TO_DRAW"; payload: { lineToDraw: LineToDraw } };

// Reducer function
const diagramReducer = (
    state: DiagramState,
    action: DiagramAction
): DiagramState => {
    switch (action.type) {
        case "ADD_PLAYER": {
            const newPlayers = new Map(state.players);
            newPlayers.set(action.payload.id, action.payload);
            return { ...state, players: newPlayers };
        }
        case "UPDATE_PLAYER": {
            const newPlayers = new Map(state.players);
            const player = newPlayers.get(action.payload.id);

            if (player) {
                newPlayers.set(action.payload.id, {
                    ...player,
                    ...action.payload.updates,
                });
            }
            console.log(newPlayers);
            return { ...state, players: newPlayers };
        }
        case "ADD_LINE": {
            const newPlayers = new Map(state.players);
            const player = newPlayers.get(action.payload.playerId);
            if (player) {
                const updatedLines = new Map(player.lines);
                updatedLines.set(action.payload.line.id, action.payload.line);
                newPlayers.set(action.payload.playerId, {
                    ...player,
                    lines: updatedLines,
                });
            }
            return { ...state, players: newPlayers };
        }
        case "UPDATE_LINE": {
            const newPlayers = new Map(state.players);
            const player = newPlayers.get(action.payload.playerId);
            if (player) {
                const updatedLines = new Map(player.lines);
                const line = updatedLines.get(action.payload.lineId);
                if (line) {
                    updatedLines.set(action.payload.lineId, {
                        ...line,
                        ...action.payload.updates,
                        connector: {
                            ...line.connector,
                            parentId:
                                action.payload.updates.connector?.parentId ??
                                line.connector?.parentId ??
                                null,
                            childId:
                                action.payload.updates.connector?.childId ??
                                line.connector?.childId ??
                                null,
                        },
                    });
                    newPlayers.set(action.payload.playerId, {
                        ...player,
                        lines: updatedLines,
                    });
                }
            }
            return { ...state, players: newPlayers };
        }
        case "SET_SELECTED_LINE": {
            return {
                ...state,
                selectedId: action.payload.lineId,
                selectedParentCircleId: action.payload.playerId,
            };
        }
        case "SELECT_LINE": {
            const newPlayers = new Map(state.players);
            const player = newPlayers.get(action.payload.playerId);
            if (player != null) {
                const updatedLines = new Map(player.lines);
                const line = player.lines.get(action.payload.lineId);
                if (line != null) {
                    updatedLines.set(action.payload.lineId, {
                        ...line,
                        selected: true,
                    });
                }
                newPlayers.set(action.payload.playerId, {
                    ...player,
                    lines: updatedLines,
                });
            }
            return {
                ...state,
                players: newPlayers,
                selectedId: action.payload.lineId,
            };
        }
        case "SELECT_PLAYER": {
            const newPlayers = new Map(state.players);
            const player = newPlayers.get(action.payload.playerId);
            if (player != null) {
                newPlayers.set(action.payload.playerId, {
                    ...player,
                    selected: true,
                });
                const playerafter = newPlayers.get(action.payload.playerId);
                console.log(playerafter);
            }
            console.log(newPlayers);
            return {
                ...state,
                players: newPlayers,
                selectedId: action.payload.playerId,
                selectedParentCircleId: action.payload.playerId,
            };
        }
        // case "DESELECT_ALL": {
        //     const newPlayers = new Map(state.players);
        //     newPlayers.forEach((player, playerId) => {
        //         const updatedLines = new Map(player.lines);
        //         updatedLines.forEach((line, lineId) => {
        //             updatedLines.set(lineId, { ...line, selected: false });
        //         });
        //         newPlayers.set(playerId, { ...player, lines: updatedLines });
        //     });
        //     return { ...state, players: newPlayers, selectedId: null };
        // }
        case "DESELECT_ALL": {
            console.log("deselecting all!!!");
            const newPlayers = new Map(
                Array.from(state.players.entries()).map(
                    ([playerId, player]) => {
                        const updatedLines = new Map(
                            Array.from(player.lines.entries()).map(
                                ([lineId, line]) => [
                                    lineId,
                                    { ...line, selected: false },
                                ]
                            )
                        );

                        return [
                            playerId,
                            {
                                ...player,
                                selected: false, // Deselect the player
                                lines: updatedLines, // Replace lines with updated lines
                            },
                        ];
                    }
                )
            );

            return { ...state, players: newPlayers, selectedId: null };
        }
        case "ANIMATE_PLAY": {
            return { ...state, animating: true };
        }
        case "STOP_ANIMATION": {
            return { ...state, animating: false };
        }
        case "SET_DRAWLINE_SELECTED": {
            return { ...state, drawLineSelected: action.payload.set };
        }
        case "SET_LINE_TO_DRAW": {
            return { ...state, lineToDraw: action.payload.lineToDraw };
        }
        default:
            throw new Error("Unhandled action type");
    }
};

// Create context
const DiagramContext = createContext<{
    state: DiagramState;
    dispatch: React.Dispatch<DiagramAction>;
} | null>(null);

// Provider component
export const DiagramProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(diagramReducer, {
        players: playerData,
        selectedId: null,
        selectedParentCircleId: null,
        animating: false,
        drawLineSelected: false,
        lineToDraw: null,
    });

    return (
        <DiagramContext.Provider value={{ state, dispatch }}>
            {children}
        </DiagramContext.Provider>
    );
};

// Custom hook for consuming the context
export const useDiagramContext = () => {
    const context = useContext(DiagramContext);
    if (!context) {
        throw new Error(
            "useDiagramContext must be used within a DiagramProvider"
        );
    }
    return context;
};
