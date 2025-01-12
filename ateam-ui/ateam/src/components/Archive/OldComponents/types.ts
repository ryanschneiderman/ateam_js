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

export interface LineType {
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

export interface LineToDraw {
    coords: Point | null;
    selectedId: string;
}

export interface Connector {
    parentId: string | null;
    childId: string | null;
}

export interface CircleData {
    key: number;
    selected: boolean;
    selectedLine: string | null;
    x: number;
    y: number;
    ref: React.RefObject<any>;
    dragging?: boolean;
    fill: string;
    lineToDraw: LineToDraw | null;
}

export interface PlayerCircleData {
    id: string;
    key: number;
    selected: boolean;
    selectedLine: string | null;
    origin: Point;
    ref: React.RefObject<any>;
    dragging?: boolean;
    fill: string;
    lineToDraw: LineToDraw | null;
    lines: Map<string, LineData>;
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
}
