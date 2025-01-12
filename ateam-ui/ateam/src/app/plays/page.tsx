"use client";
import PlayDiagrammingApp from "@/components/PlayDiagramming/PlayDiagrammingApp";
import _ from "lodash";
import { useStrictMode } from "react-konva";
import React from "react";

useStrictMode(true);

const Home = () => {
    return <PlayDiagrammingApp />;
};

export default Home;
