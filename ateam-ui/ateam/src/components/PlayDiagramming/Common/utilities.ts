import { LineData, Point, LineToDraw, Connector } from "./types";

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
