"use client";

import React from "react";
import ParticleCanvas from "../ui/home/Components/ParticleCanvas"; // Adjust the import path as needed
import PageSections from "../ui/home/Components/PageSections";
// import ParallaxTest from "../ui/home/Components/ParallaxTest";
import {
    Parallax,
    ParallaxBanner,
    ParallaxBannerLayer,
    ParallaxProvider,
} from "react-scroll-parallax";

const Home = () => {
    // You can define any props or state here if needed for the ParticleAnimation component
    return (
        <div>
            <Parallax speed={-50}>
                <ParticleCanvas />
            </Parallax>
            {/* <Parallax speed={-10} style={{ position: "relative" }}>
                <div className="flex flex-col items-center justify-between p-24 min-h-[100vh]"></div>
                <div className="w-48 h-48 bg-red-500" />
            </Parallax> */}
            <div className="z-10 relative">
                <PageSections />
            </div>

            {/* <Parallax speed={-10} style={{ position: "relative" }}>
                
            </Parallax> */}
            {/* <div className="min-h-[100vh]"></div> */}
            {/* <div className="">
                <ParticleCanvas />
            </div> */}
            {/* min-h-[300vh] flex-col items-center justify-between p-24 */}
            {/* <div className="flex flex-col items-center justify-between p-24 min-h-[100vh] z-10">
                <ParallaxTest />
            </div> */}
        </div>
    );
};

export default Home;
