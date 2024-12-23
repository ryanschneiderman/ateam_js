import { Point } from "../PlayDiagramming/types";

export function getBezierPoint(
    t: number,
    start: Point,
    cp1: Point,
    cp2: Point,
    end: Point
): Point {
    let cx = 2 * (cp1.x - start.x);
    let bx = 2 * (cp2.x - cp1.x) - cx;
    let ax = end.x - start.x - cx - bx;

    let cy = 2 * (cp1.y - start.y);
    let by = 2 * (cp2.y - cp1.y) - cy;
    let ay = end.y - start.y - cy - by;

    let xt = ax * (t * t * t) + bx * (t * t) + cx * t + start.x;
    let yt = ay * (t * t * t) + by * (t * t) + cy * t + start.y;

    return { x: xt, y: yt };
}
