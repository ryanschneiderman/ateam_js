export interface CircleData {
    key: number;
    selected: boolean;
    selectedLine: string | null;
    x: number;
    y: number;
    ref: React.RefObject<any>;
    dragging?: boolean;
    fill: string;
    drawLineInfo: DrawLineInfo | null;
}

export interface DrawLineInfo {
    coords: Point | null;
    selectedId: string;
}

export interface Point {
    x: number;
    y: number;
}
