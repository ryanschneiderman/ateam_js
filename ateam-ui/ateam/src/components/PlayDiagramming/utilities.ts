import { LineType, Point, DrawLineInfo, Connector } from "./types";

/**
 * Updates a line in the map with new data.
 * @param map The original Map of lines.
 * @param id The ID of the line to update.
 * @param updates Partial updates to apply to the line.
 * @returns A new Map with the updated line.
 */
export const updateLineInMap = (
    map: Map<string, LineType>,
    id: string,
    updates: Partial<LineType>
): Map<string, LineType> => {
    const newMap = new Map(map);
    const line = newMap.get(id);
    if (line) {
        newMap.set(id, {
            ...line,
            ...updates,
            connector: {
                ...line.connector,
                parentId:
                    updates.connector?.parentId ??
                    line.connector?.parentId ??
                    null,
                childId:
                    updates.connector?.childId ??
                    line.connector?.childId ??
                    null,
            },
        });
    }
    return newMap;
};

/**
 * Adds a new line to the map.
 * @param map The existing Map of lines.
 * @param circleId The ID of the circle to associate with the line.
 * @param origin The origin point of the line.
 * @param coords The end point of the line.
 * @param parentId The parent ID for the connector.
 * @param fill The fill color of the line.
 * @returns A new Map with the added line.
 */
export const addLineToMap = (
    map: Map<string, LineType>,
    circleId: string,
    origin: Point,
    coords: Point,
    parentId: string,
    fill: string
): [Map<string, LineType>, string] => {
    const newMap = new Map(map);
    const lineId = `line-${newMap.size + 1}`;
    const newLine: LineType = {
        id: lineId,
        circleId,
        origin,
        control: {
            x: (origin.x + coords.x) / 2,
            y: (origin.y + coords.y) / 2,
        },
        end: coords,
        fill,
        connector: { parentId, childId: null },
        selected: false,
    };

    newMap.set(lineId, newLine);
    return [newMap, lineId];
};

/**
 *
 * @param id The Id of the object to identify
 * @returns A boolean indicating if it is line
 */

export const isLine = (id: string): boolean => {
    if (id.startsWith("line")) {
        return true;
    }
    return false;
};
