import { animated, Spring } from "@react-spring/konva";
import { useState } from "react";
import { Layer, Stage } from "react-konva";

// const AnimatedRect = animated(Rect);

// const ColoredRect = () => {
//     const [flag, setFlag] = useState(false);

//     const handleClick = () => setFlag(!flag);

//     const start: Point = { x: 10, y: 100 };
//     const cp1: Point = { x: 100, y: 10 };
//     const cp2: Point = { x: 200, y: 190 };
//     const end: Point = { x: 300, y: 100 };

//     const { t } = useSpring({
//         reset: true,
//         from: { t: 0 },
//         t: flag ? 1 : 0,
//         onRest: () => setFlag(!flag),
//     });

//     const x = t.to((t) => getBezierPoint(t, start, cp1, cp2, end).x);
//     const y = t.to((t) => getBezierPoint(t, start, cp1, cp2, end).y);

//     return (
//         <Stage width={window.innerWidth} height={window.innerHeight}>
//             <Layer>
//                 // @ts-ignore
//                 <animated.Rect
//                     width={50}
//                     height={50}
//                     fill="blue"
//                     x={x}
//                     y={y}
//                     onClick={handleClick}
//                 />
//             </Layer>
//         </Stage>
//     );
// };
const ColoredRect = () => {
    const [flag, setFlag] = useState(false);

    const handleClick = () => setFlag(!flag);

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Spring
                    from={{ x: 0, shadowBlur: 0, fill: "rgb(10,50,19)" }}
                    to={{
                        x: flag ? 150 : 50,
                        shadowBlur: flag ? 25 : 5,
                        fill: flag ? "seagreen" : "hotpink",
                        width: flag ? 300 : 50,
                        height: flag ? 300 : 50,
                    }}
                >
                    {(props) => (
                        // @ts-ignore
                        <animated.Rect
                            {...props}
                            y={50}
                            onClick={handleClick}
                            width={50} // Default width for the rectangle
                            height={50} // Default height for the rectangle
                        />
                    )}
                </Spring>
            </Layer>
        </Stage>
    );
};

export default ColoredRect;
