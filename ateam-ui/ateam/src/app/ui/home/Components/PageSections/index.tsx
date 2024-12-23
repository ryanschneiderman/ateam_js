import PlaysSection from "./PlaysSection";
import StatsSection from "./StatsSection";
import AnalyticsSection from "./AnalyticsSection";
import React, { useRef, useEffect, useState } from "react";

const PageSections: React.FC = () => {
    const playsRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const [playsTop, setPlaysTop] = useState(0);
    const [statsTop, setStatsTop] = useState(0);
    useEffect(() => {
        const updatePosition = () => {
            if (playsRef.current) {
                const topPosition =
                    playsRef.current.getBoundingClientRect().height;
                setPlaysTop(topPosition);
            }
            if (statsRef.current && playsRef.current) {
                const topPosition =
                    statsRef.current.getBoundingClientRect().height +
                    playsRef.current.getBoundingClientRect().height;
                setStatsTop(topPosition);
            }
        };

        updatePosition();

        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("resize", updatePosition);
        };
    }, []);

    return (
        <div className="bg-white overflow-hidden">
            <PlaysSection ref={playsRef} />
            <StatsSection top={playsTop} ref={statsRef} />
            <AnalyticsSection top={statsTop} />
        </div>
    );
};

export default PageSections;
