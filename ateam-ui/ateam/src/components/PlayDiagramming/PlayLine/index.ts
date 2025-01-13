import { LineData, Point, LineToDraw, Connector } from "../Common/types";
import { DiagramAction, DiagramState } from "../Context/DiagramContext";

// General function to update positions
export const updatePositions = (
    dispatch: React.Dispatch<DiagramAction>,
    lineData: LineData,
    newPoint: Point,
    initialOrigin: Point,
    movingEnd: boolean
) => {
    // Determine which point is being moved and update it
    const fixedPoint = movingEnd ? initialOrigin : lineData.end;
    const movingPoint = movingEnd ? lineData.end : initialOrigin;

    // Calculate rotation angle
    const originalAngle = Math.atan2(
        movingPoint.y - fixedPoint.y,
        movingPoint.x - fixedPoint.x
    );

    const newAngle = Math.atan2(
        newPoint.y - fixedPoint.y,
        newPoint.x - fixedPoint.x
    );
    const angleDelta = newAngle - originalAngle;

    // Calculate scaling factor
    const originalDistance = Math.sqrt(
        (movingPoint.x - fixedPoint.x) ** 2 +
            (movingPoint.y - fixedPoint.y) ** 2
    );

    const newDistance = Math.sqrt(
        (newPoint.x - fixedPoint.x) ** 2 + (newPoint.y - fixedPoint.y) ** 2
    );

    const scale = newDistance / originalDistance;

    // Apply rotation and scaling to C
    const newCx =
        fixedPoint.x +
        (lineData.control.x - fixedPoint.x) * Math.cos(angleDelta) * scale -
        (lineData.control.y - fixedPoint.y) * Math.sin(angleDelta) * scale;
    const newCy =
        fixedPoint.y +
        (lineData.control.x - fixedPoint.x) * Math.sin(angleDelta) * scale +
        (lineData.control.y - fixedPoint.y) * Math.cos(angleDelta) * scale;

    const controlPoint = { x: newCx, y: newCy };
    const end = movingEnd ? newPoint : lineData.end;
    const angle = calculateLineEndAngle(end, controlPoint);
    const anchorCoords = getAnchorCoords(end.x, end.y, angle, 90);

    dispatch({
        type: "UPDATE_LINE",
        payload: {
            lineId: lineData.id,
            playerId: lineData.circleId,
            updates: {
                control: controlPoint,
                end: end,
                endAnchor: anchorCoords,
                lineEndAngle: angle,
            },
        },
    });
};

export const selectLine = (
    dispatch: React.Dispatch<DiagramAction>,
    lineData: LineData
) => {
    dispatch({
        type: "SELECT_LINE",
        payload: {
            lineId: lineData.id,
            playerId: lineData.circleId,
        },
    });
};

export const controlPointDrag = (
    dispatch: React.Dispatch<DiagramAction>,
    state: DiagramState,
    lineData: LineData,
    controlPoint: Point
) => {
    const angle = calculateLineEndAngle(lineData.end, controlPoint);
    const anchorCoords = getAnchorCoords(
        lineData.end.x,
        lineData.end.y,
        angle,
        90
    );
    dispatch({
        type: "UPDATE_LINE",
        payload: {
            lineId: lineData.id,
            playerId: lineData.circleId,
            updates: {
                control: controlPoint,
                endAnchor: anchorCoords,
                lineEndAngle: angle,
            },
        },
    });
    if (lineData.connector != null) {
        const childId = lineData.connector.childId;
        if (childId != null) {
            updateChildLineOrigin(dispatch, state, lineData, childId);
        }
    }
};

export const lineEndDrag = (
    dispatch: React.Dispatch<DiagramAction>,
    state: DiagramState,
    lineData: LineData,
    newEnd: Point,
    initialOrigin: Point
) => {
    updatePositions(dispatch, lineData, newEnd, initialOrigin, true);
    if (lineData.connector != null) {
        const childId = lineData.connector.childId;
        if (childId != null) {
            updateChildLineOrigin(dispatch, state, lineData, childId);
        }
    }
};

export const updateChildLineOrigin = (
    dispatch: React.Dispatch<DiagramAction>,
    state: DiagramState,
    lineData: LineData,
    childId: string
) => {
    const player = state.players.get(lineData.circleId);
    const childLine = player?.lines.get(childId);
    if (childLine != null) {
        if (childLine != null) {
            dispatch({
                type: "UPDATE_LINE",
                payload: {
                    lineId: childId,
                    playerId: childLine.circleId,
                    updates: {
                        origin: lineData.endAnchor,
                    },
                },
            });
        }
    }
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
    const offsetDistance = 12;
    const theta = ((rotation - angle) * Math.PI) / 180;
    const xOffset = x + offsetDistance * Math.cos(theta);
    const yOffset = y + offsetDistance * Math.sin(theta);
    return { x: xOffset, y: yOffset };
};
