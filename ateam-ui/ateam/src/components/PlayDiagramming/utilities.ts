import { LineType, Point, DrawLineInfo, Connector, CircleData } from "./types";

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
 * Updates a line in the map with new data.
 * @param map The original Map of circles.
 * @param id The ID of the circle to update.
 * @param updates Partial updates to apply to the circle.
 * @returns A new Map with the updated circle.
 */
export const updateCircleInMap = (
    map: Map<string, CircleData>,
    id: string,
    updates: Partial<CircleData>
): Map<string, CircleData> => {
    const newMap = new Map(map);
    const circle = newMap.get(id);
    if (circle) {
        newMap.set(id, {
            ...circle,
            ...updates,
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
): [Map<string, LineType>, LineType] => {
    const newMap = new Map(map);
    const lineId = `line-${newMap.size + 1}`;
    const control = {
        x: (origin.x + coords.x) / 2,
        y: (origin.y + coords.y) / 2,
    };
    const angle = calculateLineEndAngle(coords, control);
    const anchorCoords = getAnchorCoords(coords.x, coords.y, angle, 90);
    const newLine: LineType = {
        id: lineId,
        circleId,
        origin,
        control: control,
        end: coords,
        endAnchor: anchorCoords,
        fill,
        connector: { parentId, childId: null },
        selected: true,
    };

    newMap.set(lineId, newLine);
    return [newMap, newLine];
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

export const calculateLineEndAngle = (
    endPoint: Point,
    control: Point
): number => {
    // Calculate changes in x and y from the derivative formula at t = 1
    const deltaX = endPoint.x - control.x;
    const deltaY = endPoint.y - control.y;

    // atan2 returns the angle in radians and we convert it to degrees
    // Adding 90 degrees to rotate the triangle to make its base perpendicular
    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90;
    return angle;
};

export const getAnchorCoords = (
    x: number,
    y: number,
    rotation: number,
    angle: number
) => {
    console.log("in anchor coords");
    console.log({ x: x, y: y, rotation: rotation });
    const offsetDistance = 12;
    const theta = ((rotation - angle) * Math.PI) / 180;
    const xOffset = x + offsetDistance * Math.cos(theta);
    const yOffset = y + offsetDistance * Math.sin(theta);
    return { x: xOffset, y: yOffset };
};
