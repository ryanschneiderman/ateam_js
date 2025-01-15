export interface PlayerCircleData {
    id: string;
    key: number;
    selected: boolean;
    selectedLine: string | null;
    origin: Point;
    ref: React.RefObject<any>;
    dragging?: boolean;
    fill: string;
    lines: Map<string, LineData>;
    connector: Connector | null;
    lineToDraw: Point | null;
}

// Define the extended type for control point
export interface ControlPoint {
    x: number;
    y: number;
    dragging?: boolean;
}

export interface Point {
    x: number;
    y: number;
}

export interface Connector {
    parentId: string | null;
    childId: string | null;
}

export interface LineData {
    id: string;
    circleId: string;
    origin: { x: number; y: number };
    control: { x: number; y: number };
    end: { x: number; y: number };
    fill: string;
    selected: boolean;
    connector: Connector | null;
    endAnchor: { x: number; y: number };
    lineEndAngle: number;
}
