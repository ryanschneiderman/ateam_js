interface CourtSvgProps {
    arcStartX: number;
    arcStartY: number;
    arcEndX: number;
    arcEndY: number;
    arcXRadius: number;
    arcYRadius: number;
    arcLineLength: number;
    circleRadius: number;
}

interface PlayerPieceProps {
    fill: string;
    stroke: string;
    translateX: [string, string] | [number, number];
    translateY: [string, string] | [number, number];
    speed: number;
    startScroll: number;
    endScroll: number;
}
