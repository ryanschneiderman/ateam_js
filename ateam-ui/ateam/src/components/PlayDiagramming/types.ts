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
}

export interface DrawLineInfo {
    coords: Point | null;
    selectedId: string;
}

export interface Connector {
    parentId: string | null;
    childId: string | null;
}
