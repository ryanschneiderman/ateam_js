// PageSectionDescription.tsx
import React, { CSSProperties } from "react";
import { Playfair_Display, Montserrat } from "next/font/google";
// import "./pageSectionDescription.css";

interface PageSectionDescriptionProps {
    title: string[];
    description: string;
    listItems: string[];
    buttonLink: string;
    buttonLabel: string;
    className?: string;
    fontColor: string;
    backgroundColor?: string;
    width?: string;
    style?: CSSProperties;
}

const montserrat = Montserrat({
    weight: "700",
    subsets: ["latin"],
    display: "swap",
});

const montserratLight = Montserrat({
    weight: "500",
    subsets: ["latin"],
    display: "swap",
});
// text-ateam-dark-grey

const PageSectionDescription: React.FC<PageSectionDescriptionProps> = ({
    title,
    description,
    listItems,
    buttonLink,
    buttonLabel,
    fontColor,
    className = "",
    backgroundColor,
    width,
    style = {},
}) => {
    return (
        <div
            className={`${className} ${fontColor} p-12 ${backgroundColor} ${width} m-5`}
            style={style}
        >
            <h1 className={`text-5xl font-bold ${montserrat.className}`}>
                {title.map((item, key) => (
                    <div key={key}>
                        {item}
                        <br></br>
                    </div>
                ))}
            </h1>
            <p className="text-xl font-light pt-6 pb-6">{description}</p>
            <ul className="pt-4 list-disc pl-6">
                {listItems.map((item, index) => (
                    <li className="p-3" key={index}>
                        {item}
                    </li>
                ))}
            </ul>
            <div className="mt-6 flex">
                <a
                    href={buttonLink}
                    className={`learn-more-btn text-sm text-ateam-pink tracking-widest ${montserratLight.className}`}
                >
                    {buttonLabel}
                </a>
                <div className="relative bottom-3 left-3">
                    <svg
                        width={"3vw"}
                        height={"3vw"}
                        xmlns="http://www.w3.org/2000/svg"
                        overflow="hidden"
                        className="absolute hover:scale-110 transition-transform duration-300 ease-in-out"
                    >
                        <circle
                            cx={"1.5vw"}
                            cy={"1.5vw"}
                            r="1vw"
                            className="fill-ateam-pink"
                            filter="url(#colored-dropshadow)"
                        />
                        <path
                            id="XMLID_222_"
                            d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213  C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  C255,161.018,253.42,157.202,250.606,154.389z"
                            transform="scale(0.04) translate(450, 400)"
                            fill="white"
                        ></path>
                        <defs>
                            <filter
                                id="colored-dropshadow"
                                height="200%"
                                width="200%"
                                x="-20%"
                                y="-20%"
                            >
                                <feDropShadow
                                    dx="0"
                                    dy="0"
                                    stdDeviation="3"
                                    floodColor="#ff1053"
                                />
                            </filter>
                        </defs>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default PageSectionDescription;
